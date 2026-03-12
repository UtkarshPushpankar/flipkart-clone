import { FiGift, FiHelpCircle, FiPieChart, FiShoppingBag } from "react-icons/fi";

const ABOUT_LINKS = [
  "Contact Us",
  "About Us",
  "Careers",
  "Flipkart Stories",
  "Press",
  "Corporate Information",
];

const GROUP_LINKS = ["Myntra", "Cleartrip", "Shopsy"];
const HELP_LINKS = ["Payments", "Shipping", "Cancellation & Returns", "FAQ"];
const POLICY_LINKS = [
  "Cancellation & Returns",
  "Terms Of Use",
  "Security",
  "Privacy",
  "Sitemap",
  "Grievance Redressal",
  "EPR Compliance",
  "FSSAI Food Safety Connect App",
];

export default function Footer() {
  return (
    <footer className="mt-10 bg-[#172337] text-[#878787]">
      <div className="fk-page py-9">
        <div className="grid grid-cols-2 gap-6 border-b border-[#454d5e] pb-7 md:grid-cols-6">
          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wide">About</h4>
            <ul className="space-y-1.5 text-xs text-white">
              {ABOUT_LINKS.map((item) => (
                <li key={item} className="hover:underline">
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wide">Group Companies</h4>
            <ul className="space-y-1.5 text-xs text-white">
              {GROUP_LINKS.map((item) => (
                <li key={item} className="hover:underline">
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wide">Help</h4>
            <ul className="space-y-1.5 text-xs text-white">
              {HELP_LINKS.map((item) => (
                <li key={item} className="hover:underline">
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wide">Consumer Policy</h4>
            <ul className="space-y-1.5 text-xs text-white">
              {POLICY_LINKS.map((item) => (
                <li key={item} className="hover:underline">
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:border-l md:border-[#454d5e] md:pl-6">
            <h4 className="mb-3 text-xs uppercase tracking-wide">Mail Us:</h4>
            <p className="text-xs leading-5 text-white">
              Flipkart Internet Private Limited,
              <br />
              Buildings Alyssa, Begonia &
              <br />
              Clove Embassy Tech Village,
              <br />
              Outer Ring Road, Devarabeesanahalli Village,
              <br />
              Bengaluru, 560103,
              <br />
              Karnataka, India
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wide">Registered Office:</h4>
            <p className="text-xs leading-5 text-white">
              Flipkart Internet Private Limited,
              <br />
              Buildings Alyssa, Begonia &
              <br />
              Clove Embassy Tech Village,
              <br />
              Outer Ring Road, Devarabeesanahalli Village,
              <br />
              Bengaluru, 560103, Karnataka, India
              <br />
              CIN : U51109KA2012PTC066107
              <br />
              Telephone: 044-45614700 / 044-67415800
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#454d5e] py-5 text-sm text-white">
          <a href="#" className="flex items-center gap-2 hover:text-[#ffe500]">
            <FiShoppingBag className="text-[#ffe500]" /> Become a Seller
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-[#ffe500]">
            <FiPieChart className="text-[#ffe500]" /> Advertise
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-[#ffe500]">
            <FiGift className="text-[#ffe500]" /> Gift Cards
          </a>
          <a href="#" className="flex items-center gap-2 hover:text-[#ffe500]">
            <FiHelpCircle className="text-[#ffe500]" /> Help Center
          </a>
          <span className="text-white">© 2007-2026 Flipkart.com</span>
        </div>

        <div className="pt-4 text-xs text-[#c2c2c2]">
          No cost EMI from selected banks. Keep shopping with trust and secure payments.
        </div>
      </div>
    </footer>
  );
}

