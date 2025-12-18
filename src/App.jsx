import { useState,useEffect, useRef} from 'react'
import { ResponsiveSankey } from '@nivo/sankey'
import { toPng } from 'html-to-image';

function App() {
  // 1. 数据状态：默认给一点初始数据，让图表不为空
const [links, setLinks] = useState(() => {
    // 尝试从本地存储读取
    const savedData = localStorage.getItem('my-sankey-data');
    // 如果有，就用存的数据；如果没有，就用默认数据
    return savedData ? JSON.parse(savedData) : [
      { source: "Applications", target: "Interviews", value: 5 },
      { source: "Applications", target: "Rejected", value: 20 },
      { source: "Interviews", target: "Offers", value: 2 },
    ];
  });

  // 2. 输入框状态
  const [inputSource, setInputSource] = useState("");
  const [inputTarget, setInputTarget] = useState("");
  const [inputValue, setInputValue] = useState("");

  // --- 功能 A: 添加数据 ---
  const handleAddLink = () => {
    if (!inputSource || !inputTarget || !inputValue) return;

    const newLink = {
      source: inputSource,
      target: inputTarget,
      value: Number(inputValue)
    };

    setLinks([...links, newLink]);
    
    // 清空输入框，方便下一次输入
    setInputSource("");
    setInputTarget("");
    setInputValue("");
  };

  // --- 功能 B: 删除数据 (新功能!) ---
  // index 代表我们要删第几行数据
  const handleDeleteLink = (indexToDelete) => {
    // filter 是 React 里最常用的删除大法
    // 逻辑：留下所有 index 不等于 indexToDelete 的元素
    const newLinks = links.filter((_, index) => index !== indexToDelete);
    setLinks(newLinks);
  };

  // --- 自动计算 Nodes (不需要动) ---
  const uniqueNodes = new Set();
  links.forEach(link => {
    uniqueNodes.add(link.source);
    uniqueNodes.add(link.target);
  });
  const nodes = Array.from(uniqueNodes).map(id => ({ id }));
  const data = { nodes, links };

  // --- 新增：截图功能 ---
  
  // 1. 创建一个“引用钩子”，用来标记我们要截图的那个 div
  const chartRef = useRef(null);

  // 2. 下载图片的函数
  const handleDownload = async () => {
    if (chartRef.current === null) return;

    try {
      // 这里的 backgroundColor: '#ffffff' 很重要，不然导出的背景是透明的
      const dataUrl = await toPng(chartRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
      
      // 创建一个临时的下载链接并点击它
      const link = document.createElement('a');
      link.download = 'my-job-search-sankey.png'; // 下载的文件名
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Oops, download failed:', err);
    }
  };

  //监听
  useEffect(() => {
    localStorage.setItem('my-sankey-data', JSON.stringify(links));
  }, [links]);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Job Search Sankey Builder</h1>

      {/* 布局容器：左边控制，右边图表 */}
      <div style={{ display: 'flex', gap: '40px' }}>
        
        {/* --- 左边：控制面板 (30% 宽度) --- */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          
          {/* 输入区域 */}
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>Add New Flow</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                placeholder="From (e.g. Applied)" 
                value={inputSource}
                onChange={(e) => setInputSource(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input 
                placeholder="To (e.g. Interview)" 
                value={inputTarget}
                onChange={(e) => setInputTarget(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input 
                placeholder="Amount (e.g. 10)" 
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button 
                onClick={handleAddLink}
                style={{ 
                  padding: '10px', background: '#228be6', color: 'white', 
                  border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' 
                }}
              >
                Add Flow +
              </button>
            </div>
          </div>

          {/* 数据列表区域 (新功能!) */}
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Current Data:</h4>
            {links.length === 0 ? <p style={{color: '#999'}}>No data yet.</p> : null}
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {links.map((link, index) => (
                <li key={index} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px', borderBottom: '1px solid #f0f0f0' 
                }}>
                  <span>
                    <b>{link.source}</b> → <b>{link.target}</b> : {link.value}
                  </span>
                  <button 
                    onClick={() => handleDeleteLink(index)}
                    style={{ 
                      background: '#fa5252', color: 'white', border: 'none', 
                      borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* --- 新增：下载按钮 (放在左侧栏的最下面) --- */}
          <div style={{ marginTop: '20px' }}>
             <button 
               onClick={handleDownload}
               style={{ 
                 width: '100%', padding: '12px', background: '#40c057', color: 'white', 
                 border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px'
               }}
             >
               Download Image 📸
             </button>
          </div>
        

        {/* --- 右边：图表显示 (70% 宽度) --- */}
        <div 
        
        ref={chartRef}
        style={{ flex: 2, width:'1000px', height: '600px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          {links.length > 0 ? (
            <ResponsiveSankey 
              data={data}
              margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
              align="justify"
              colors={{ scheme: 'category10' }}
              nodeOpacity={1}
              nodeThickness={18}
              nodeInnerPadding={3}
              nodeSpacing={24}
              nodeBorderWidth={0}
              linkBlendMode="normal"
              enableLinkGradient={true}
            />
          ) : (
            <p style={{ textAlign: 'center', marginTop: '100px', color: '#999' }}>
              Add some data to see the chart!
            </p>
          )}
        </div>

      </div>
    </div>
    
  )
}

export default App