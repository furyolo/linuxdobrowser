import sys, logging, time, random, re, asyncio
from DrissionPage import Chromium

logging.basicConfig(
    format = "%(asctime)s %(levelname)s:%(name)s: %(message)s",
    level = logging.INFO,
    datefmt = "%H:%M:%S",
    stream = sys.stderr
)
logger = logging.getLogger(__name__)

def wait_for_new_topics(tab: Chromium, end_topic_id: str):
    # 从end_topic_id中提取数字
    current_number = int(re.search(r'ember(\d+)', end_topic_id).group(1))
    next_id = f'ember{current_number + 20}'
    
    # 滚动到页面底部
    tab.actions.scroll(on_ele=f'#{end_topic_id}')
    
    # 等待新元素加载
    tab.wait.eles_loaded(f'#{next_id}', timeout=10)

def is_bottom_of_page(tab: Chromium):
    # 获取当前滚动位置
    current_scroll = tab.run_js('return window.pageYOffset')
    # 获取页面总高度
    total_height = tab.run_js('return document.documentElement.scrollHeight')
    # 获取视窗高度
    viewport_height = tab.run_js('return window.innerHeight')
    
    # 如果当前滚动位置加上视窗高度等于或接近页面总高度，则认为到达底部
    return (current_scroll + viewport_height) >= (total_height - 200)  # 允许200像素的误差

async def human_like_scroll(tab: Chromium):
    while not is_bottom_of_page(tab):
        # 随机滚动距离，范围可以根据实际情况调整
        scroll_distance = random.randint(200, 500)
        
        # 有 3% 的概率向上滚动一小段距离
        if random.random() < 0.03:
            tab.actions.scroll(-random.randint(50, 100))
            await asyncio.sleep(random.uniform(0.5, 1))
        
        tab.actions.scroll(scroll_distance)
        
        # 模拟阅读时间，根据滚动距离调整
        read_time = scroll_distance / 100 * random.uniform(0.2, 0.5)
        await asyncio.sleep(read_time)
        
        # 有 3% 的概率停顿较长时间，模拟仔细阅读
        if random.random() < 0.03:
            await asyncio.sleep(random.uniform(2, 5))

async def process_topic(topic: Chromium, n: int, semaphore: asyncio.Semaphore):
    async with semaphore:
        num_posts = topic('.badge-posts').text
        if 'k' in num_posts.lower() or int(num_posts) >= 1:
            topic_ele = topic('.link-top-line')('.title raw-link raw-topic-link')
            title = topic_ele.text
            logger.info(f'开始阅读第{n+1}个主题: {title}')
            # 记录开始时间
            start_time = time.time()
            # 在新标签页打开链接
            new_tab = topic_ele.ele('@dir=auto').click.middle()
            new_tab.wait.eles_loaded('.topic-post clearfix regular')
            await human_like_scroll(new_tab)
            new_tab.close()
            # 计算经过的时间
            elapsed_time = time.time() - start_time
            logger.info(f'第{n+1}个主题阅读完毕, 耗时 {elapsed_time:.0f} 秒')
        else:
            logger.info('跟帖数量小于1, 跳过阅读')
