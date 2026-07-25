type ProjectVisualType = 'cabana' | 'dashboard' | 'ecommerce' | 'barnes' | 'atlas'

export default function ProjectVisual({ type, color }: { type: ProjectVisualType; color: string }) {
  return (
    <div className="project-visual" style={{ '--visual-color': color } as React.CSSProperties}>
      {type === 'cabana' && <CabanaVisual />}
      {type === 'dashboard' && <DashboardVisual />}
      {type === 'ecommerce' && <EcommerceVisual />}
      {type === 'barnes' && <BarnesVisual />}
      {type === 'atlas' && <AtlasVisual />}
    </div>
  )
}

function BrowserChrome({ children, url }: { children: React.ReactNode; url: string }) {
  return (
    <div className="visual-browser">
      <div className="visual-browser-bar">
        <div className="visual-browser-dots">
          <span /><span /><span />
        </div>
        <div className="visual-browser-url">{url}</div>
      </div>
      <div className="visual-browser-content">{children}</div>
    </div>
  )
}

function CabanaVisual() {
  return (
    <BrowserChrome url="cabanafilters.com">
      <div className="visual-storefront">
        <div className="visual-store-nav">
          <span className="visual-store-logo" />
          <div className="visual-store-links">
            <span /><span /><span />
          </div>
        </div>
        <div className="visual-filter-grid">
          <div className="visual-filter-card" style={{ borderColor: 'var(--visual-color)' }}>
            <div className="visual-filter-img" />
            <div className="visual-filter-bar" style={{ width: '70%' }} />
            <div className="visual-filter-bar visual-filter-bar-sm" style={{ width: '40%' }} />
          </div>
          <div className="visual-filter-card">
            <div className="visual-filter-img" />
            <div className="visual-filter-bar" style={{ width: '60%' }} />
            <div className="visual-filter-bar visual-filter-bar-sm" style={{ width: '35%' }} />
          </div>
          <div className="visual-filter-card">
            <div className="visual-filter-img" />
            <div className="visual-filter-bar" style={{ width: '80%' }} />
            <div className="visual-filter-bar visual-filter-bar-sm" style={{ width: '45%' }} />
          </div>
        </div>
      </div>
    </BrowserChrome>
  )
}

function DashboardVisual() {
  return (
    <BrowserChrome url="studioplayer.com">
      <div className="visual-dashboard">
        <div className="visual-dash-sidebar">
          <span className="visual-dash-icon" /><span className="visual-dash-icon" /><span className="visual-dash-icon" />
          <span className="visual-dash-icon visual-dash-icon-active" /><span className="visual-dash-icon" />
        </div>
        <div className="visual-dash-main">
          <div className="visual-dash-header" />
          <div className="visual-dash-cards">
            <div className="visual-dash-card"><div className="visual-dash-num" /><div className="visual-dash-label" /></div>
            <div className="visual-dash-card"><div className="visual-dash-num" /><div className="visual-dash-label" /></div>
            <div className="visual-dash-card"><div className="visual-dash-num" /><div className="visual-dash-label" /></div>
          </div>
          <div className="visual-dash-chart">
            <div className="visual-dash-bar" style={{ height: '40%' }} />
            <div className="visual-dash-bar" style={{ height: '65%' }} />
            <div className="visual-dash-bar" style={{ height: '50%' }} />
            <div className="visual-dash-bar" style={{ height: '80%' }} />
            <div className="visual-dash-bar" style={{ height: '45%' }} />
            <div className="visual-dash-bar" style={{ height: '70%' }} />
          </div>
        </div>
      </div>
    </BrowserChrome>
  )
}

function EcommerceVisual() {
  return (
    <BrowserChrome url="mylogomat.com">
      <div className="visual-ecommerce">
        <div className="visual-eco-product">
          <div className="visual-eco-preview">
            <div className="visual-eco-mat" />
          </div>
          <div className="visual-eco-details">
            <div className="visual-eco-bar" style={{ width: '60%' }} />
            <div className="visual-eco-bar visual-eco-bar-sm" style={{ width: '30%' }} />
            <div className="visual-eco-customize" style={{ borderColor: 'var(--visual-color)' }}>
              <span className="visual-eco-upload" />
              <span className="visual-eco-upload" />
              <span className="visual-eco-upload" />
            </div>
            <div className="visual-eco-cart" style={{ background: 'var(--visual-color)' }} />
          </div>
        </div>
      </div>
    </BrowserChrome>
  )
}

function BarnesVisual() {
  return (
    <BrowserChrome url="barnes-hauling.vercel.app">
      <div className="visual-barnes">
        <div className="visual-barnes-hero">
          <div className="visual-barnes-logo" />
          <div className="visual-barnes-tagline" />
        </div>
        <div className="visual-barnes-dumpsters">
          <div className="visual-barnes-dumpster">
            <div className="visual-barnes-dumpster-img" />
            <div className="visual-barnes-dumpster-price" style={{ color: 'var(--visual-color)' }}>$350</div>
            <div className="visual-barnes-dumpster-size" />
          </div>
          <div className="visual-barnes-dumpster">
            <div className="visual-barnes-dumpster-img" />
            <div className="visual-barnes-dumpster-price">Contact</div>
            <div className="visual-barnes-dumpster-size" />
          </div>
        </div>
        <div className="visual-barnes-steps">
          <span /><span /><span /><span />
        </div>
      </div>
    </BrowserChrome>
  )
}

function AtlasVisual() {
  return (
    <div className="visual-atlas">
      <div className="visual-atlas-phone">
        <div className="visual-atlas-notch" />
        <div className="visual-atlas-screen">
          <div className="visual-atlas-globe">
            <div className="visual-atlas-pin" style={{ top: '30%', left: '45%' }} />
            <div className="visual-atlas-pin visual-atlas-pin-2" style={{ top: '55%', left: '60%' }} />
            <div className="visual-atlas-pin visual-atlas-pin-3" style={{ top: '40%', left: '25%' }} />
          </div>
          <div className="visual-atlas-card">
            <div className="visual-atlas-flag" />
            <div className="visual-atlas-info">
              <div className="visual-atlas-bar" style={{ width: '50%' }} />
              <div className="visual-atlas-bar visual-atlas-bar-sm" style={{ width: '30%' }} />
            </div>
          </div>
          <div className="visual-atlas-progress" style={{ borderColor: 'var(--visual-color)' }}>
            <div className="visual-atlas-progress-fill" style={{ width: '65%', background: 'var(--visual-color)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
