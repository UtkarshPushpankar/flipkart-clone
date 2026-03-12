export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#172337', color: '#9e9e9e', marginTop: '24px' }}>
      <div className="max-w-[1300px] mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-8" style={{ borderBottom: '1px solid #2c3e50' }}>
          <div>
            <h4 className="text-[11px] font-semibold uppercase mb-4 tracking-wider" style={{ color: '#616161' }}>About</h4>
            <ul className="space-y-2">
              {['Contact Us', 'About Us', 'Careers', 'Flipkart Stories', 'Press', 'Corporate Information'].map((item) => (
                <li key={item}><a href="#" className="text-xs hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase mb-4 tracking-wider" style={{ color: '#616161' }}>Group Companies</h4>
            <ul className="space-y-2">
              {['Myntra', 'Cleartrip', 'Shopsy'].map((item) => (
                <li key={item}><a href="#" className="text-xs hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase mb-4 tracking-wider" style={{ color: '#616161' }}>Help</h4>
            <ul className="space-y-2">
              {['Payments', 'Shipping', 'Cancellation & Returns', 'FAQ', 'Report Infringement'].map((item) => (
                <li key={item}><a href="#" className="text-xs hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase mb-4 tracking-wider" style={{ color: '#616161' }}>Consumer Policy</h4>
            <ul className="space-y-2">
              {['Return Policy', 'Terms Of Use', 'Security', 'Privacy', 'EPR Compliance'].map((item) => (
                <li key={item}><a href="#" className="text-xs hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase mb-4 tracking-wider" style={{ color: '#616161' }}>Social</h4>
            <ul className="space-y-2">
              {['🐦 Twitter', '📘 Facebook', '📸 Instagram', '▶️ YouTube'].map((item) => (
                <li key={item}><a href="#" className="text-xs hover:text-white transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <span>🏢</span>
              <span>Sell on Flipkart</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>🎯</span>
              <span>Advertise</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>🎁</span>
              <span>Gift Cards</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>❓</span>
              <span>Help Centre</span>
            </span>
          </div>
          <p className="text-xs" style={{ color: '#616161' }}>
            © 2007–2026 Flipkart.com (Clone for educational purposes)
          </p>
        </div>
      </div>
    </footer>
  );
}
