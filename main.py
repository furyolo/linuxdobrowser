import asyncio
import argparse
from DrissionPage import Chromium, ChromiumOptions
from autobrowser import wait_for_new_topics, process_topic

async def browse_with_browser(browser_choice, mode, browser_paths, browser_ports):
    """使用指定浏览器进行浏览"""
    if browser_choice == "":
        co = ChromiumOptions().set_local_port(browser_ports['chrome'])
    elif browser_choice in browser_paths:
        path = browser_paths[browser_choice]
        co = ChromiumOptions().set_local_port(browser_ports[browser_choice]).set_browser_path(path)
    else:
        print("无效的选择，将使用系统默认路径。")
        co = ChromiumOptions().set_local_port(browser_ports['chrome'])

    browser = Chromium(co)
    tab = browser.new_tab('https://linux.do/')
    topic_list_body = tab('.topic-list-body')
    
    if mode == 'short':
        topic_list = topic_list_body.eles('t=tr')[:10]
    else:
        while True:
            topic_list = topic_list_body.eles('t=tr') 
            end_topic_id = topic_list[-1].attr('data-topic-id')
            if len(topic_list) > 50:
                break
            try:
                wait_for_new_topics(tab, end_topic_id)
            except TimeoutError:
                print('没有更多主题加载，结束程序')
                break

    semaphore = asyncio.Semaphore(3)
    tasks = [process_topic(topic, n, semaphore) for n, topic in enumerate(topic_list)]
    await asyncio.gather(*tasks)
    
    # 关闭浏览器
    browser.quit()

async def main():
    parser = argparse.ArgumentParser(description='浏览 linux.do 主题')
    parser.add_argument('-m', '--mode', choices=['short', 'long'], default='short',
                       help='浏览模式: short(浏览10个主题) 或 long(浏览所有主题)')
    parser.add_argument('-b', '--browser', choices=['single', 'all'], default='single',
                       help='浏览器模式: single(单个浏览器) 或 all(所有浏览器)')
    args = parser.parse_args()

    browser_paths = {
        'chrome': r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        'edge': r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe', 
        '115': r'C:\Users\Andy\AppData\Local\115Chrome\Application\115chrome.exe',
        'doubao': r'C:\Users\Andy\AppData\Local\Doubao\Application\app\Doubao.exe', 
    }
    browser_ports = {
        'chrome': 11223,
        'edge': 11224,
        '115': 11225,
        'doubao': 11226,
    }
    
    if args.browser == 'single':
        print("请选择要使用的浏览器 (直接按回车使用系统默认路径):")
        for key in browser_paths.keys():
            print(f"- {key}")
        choice = input("请输入你的选择: ").lower().strip()
        await browse_with_browser(choice, args.mode, browser_paths, browser_ports)
    else:
        for browser_name in browser_paths.keys():
            print(f"\n正在使用 {browser_name} 浏览...")
            await browse_with_browser(browser_name, args.mode, browser_paths, browser_ports)

if __name__ == "__main__":
    asyncio.run(main())