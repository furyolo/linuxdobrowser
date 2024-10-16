import asyncio
from DrissionPage import Chromium, ChromiumOptions
from autobrowser import wait_for_new_topics, process_topic

async def main():
    # 设置浏览器路径
    browser_paths = {
        'chrome': r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '115': r'C:\Users\Andy\AppData\Local\115Chrome\Application\115chrome.exe',
        'edge': r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe', 
        'doubao': r'C:\Users\Andy\AppData\Local\Doubao\Application\app\Doubao.exe'
    }
    browser_ports = {
        'chrome': 9223,
        '115': 9224,
        'edge': 9225,
        'doubao': 9226
    }
    
    # 询问用户选择浏览器
    print("请选择要使用的浏览器 (直接按回车使用系统默认路径):")
    for key in browser_paths.keys():
        print(f"- {key}")
    
    choice = input("请输入你的选择: ").lower().strip()
    
    if choice == "":
        co = ChromiumOptions().set_local_port(browser_ports['chrome'])
    elif choice in browser_paths:
        path = browser_paths[choice]
        co = ChromiumOptions().set_local_port(browser_ports[choice]).set_browser_path(path)
    else:
        print("无效的选择，将使用系统默认路径。")
        co = ChromiumOptions().set_local_port(browser_ports['chrome'])

    browser = Chromium(co)
    tab = browser.new_tab('https://linux.do/')
    topic_list_body = tab('.topic-list-body')

    # 循环加载更多主题
    while True: 
        topic_list = topic_list_body.eles('t=tr')
        end_topic_id = topic_list[-1].attr('id')
        if len(topic_list) > 50:
            break
        try:
            # 尝试加载更多主题
            wait_for_new_topics(tab, end_topic_id)
        except TimeoutError:
            # 如果超时，说明没有更多主题了，退出循环
            print('没有更多主题加载，结束程序')
            break

    semaphore = asyncio.Semaphore(3)
    tasks = [process_topic(topic, n, semaphore) for n, topic in enumerate(topic_list)]
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())