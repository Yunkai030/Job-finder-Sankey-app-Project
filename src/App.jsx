// 1. Import the library (Like 'import' in Python)
import { ResponsiveSankey } from '@nivo/sankey'

// 2. Define the Data
// In Python, this is just a Dictionary. In JS, it's an Object.
// Sankeys need two things: NODES (the boxes) and LINKS (the flowing lines).
const data = {
  nodes: [
    { id: "Applications" },
    { id: "Interviews" },
    { id: "Rejected" },
    { id: "Offers" }
  ],
  links: [
    { source: "Applications", target: "Interviews", value: 5 },
    { source: "Applications", target: "Rejected", value: 10 },
    { source: "Interviews", target: "Offers", value: 2 },
    { source: "Interviews", target: "Rejected", value: 3 }
  ]
}

// 3. The Component (Like a Class or Function in Python)
// This function returns HTML (actually JSX) that the browser renders.
function App() {
  
  // We return a "div" container. 
  // IMPORTANT: Nivo charts need a defined height, or they won't show up.
  return (
    <div style={{ height: '500px', width: '1000px', margin: '50px auto' }}>
      <h1>My Job Search Sankey</h1>
      
      {/* This is the Nivo Component. We pass our 'data' into it. */}
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
        nodeBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.8 ] ] }}
        linkBlendMode="multiply"
        enableLinkGradient={true}
      />
    </div>
  )
}

export default App