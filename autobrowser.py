import asyncio
import logging
import random
import sys
import time

from DrissionPage._pages.mix_tab import MixTab
from typing import Any, Union

logging.basicConfig(
    format = "%(asctime)s %(levelname)s:%(name)s: %(message)s",
    level = logging.INFO,
    datefmt = "%H:%M:%S",
    stream = sys.stderr
)
logger = logging.getLogger(__name__)

# 定义tab参数可以接受的类型
def wait_for_new_topics(tab: Union[MixTab, Any], end_topic_id: str) -> None:
    # end_topic_id转为数字
    current_number = int(end_topic_id)
    
    # 滚动到页面底部
    # 使用正确的API访问actions属性
    tab.scroll.to_bottom()
    
def is_bottom_of_page(tab: Union[MixTab, Any]) -> bool:
    # 获取当前滚动位置
    current_scroll: int = tab.run_js('return window.pageYOffset')
    # 获取页面总高度
    total_height: int = tab.run_js('return document.documentElement.scrollHeight')
    # 获取视窗高度
    viewport_height: int = tab.run_js('return window.innerHeight')
    
    # 如果当前滚动位置加上视窗高度等于或接近页面总高度，则认为到达底部
    return (current_scroll + viewport_height) >= (total_height - 100)  # 允许100像素的误差

async def human_like_scroll(tab: Union[MixTab, Any]) -> None:
    # 随机滚动距离，范围可以根据实际情况调整
    scroll_distance: int = random.randint(200, 500)
        
    # 有 3% 的概率向上滚动一小段距离
    if random.random() < 0.03:
        tab.scroll.up(random.randint(50, 100))
        await asyncio.sleep(random.uniform(0.5, 1))
        
    tab.scroll.down(scroll_distance)
        
    # 模拟阅读时间，根据滚动距离调整
    read_time: float = scroll_distance / 100 * random.uniform(0.2, 0.5)
    await asyncio.sleep(read_time)
        
    # 有 3% 的概率停顿较长时间，模拟仔细阅读
    if random.random() < 0.03:
        await asyncio.sleep(random.uniform(2, 5))

async def process_topic(topic: Union[MixTab, Any], n: int, semaphore: asyncio.Semaphore) -> None:
    async with semaphore:
        num_posts: str = str(topic('.badge-posts').text)
        if 'k' in num_posts.lower() or int(num_posts) >= 1:
            topic_ele: Any = topic('.link-top-line')('.title raw-link raw-topic-link')
            title: str = str(topic_ele.text)
            logger.info(f'开始阅读第{n+1}个主题: {title}')
            
            start_time: float = time.time()
            # 获取链接元素，用于重复打开
            link_ele: Any = topic_ele.ele('@dir=auto')
            
            # 在新标签页打开链接
            new_tab: Any = link_ele.click.middle()
            new_tab.wait.eles_loaded('.topic-body clearfix', timeout=15)
                
            # 记录滚动开始时间
            scroll_start_time: float = time.time()
                
            # 执行滚动，但最多持续60秒
            while time.time() - scroll_start_time < 60 and not is_bottom_of_page(new_tab):
                await human_like_scroll(new_tab)

            # # 等待10秒
            # await asyncio.sleep(15)   
            # 关闭当前标签页
            new_tab.close()
                
            logger.info(f'第{n+1}个主题阅读完毕, 耗时 {time.time() - start_time:.0f} 秒')
        else:
            logger.info('跟帖数量小于1, 跳过阅读')
