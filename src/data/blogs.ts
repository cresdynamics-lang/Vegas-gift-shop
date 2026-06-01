export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
  date: string;
  category: string;
  readMinutes: number;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'corporate-gifting-lasting-impression',
    title: 'The Art of Corporate Gifting: Making a Lasting Impression',
    excerpt:
      'How thoughtful corporate gifts strengthen relationships, boost morale, and keep your brand top of mind long after the event ends.',
    image: '/products/product_14.jpeg',
    author: 'Vegas Gift Shop Team',
    date: '2026-04-12',
    category: 'Corporate',
    readMinutes: 6,
    content: [
      'Corporate gifting is more than a courtesy, it is a strategic touchpoint. A well-chosen award, branded set, or personalized keepsake tells clients and teams that you value the relationship, not just the transaction.',
      'Start by matching the gift to the milestone: onboarding kits for new hires, crystal awards for top performers, and premium drinkware for long-term partners. Personalization, names, dates, and logos, turns a useful item into a memorable one.',
      'Timing matters. Deliver before year-end reviews, after project wins, or alongside major announcements so your gift feels intentional. Pair every order with clear customization instructions and quality packaging.',
      'At Vegas Gift Shop, we help Nairobi businesses source, brand, and deliver gifts at scale, with same-day options in the city when you need to move fast.',
    ],
  },
  {
    slug: 'selecting-perfect-luxury-watch',
    title: 'A Guide to Selecting the Perfect Luxury Watch',
    excerpt:
      'From dial size to movement type, here is how to pick a timepiece that suits their style and every occasion.',
    image: '/products/product_16.jpeg',
    author: 'Vegas Gift Shop Team',
    date: '2026-03-28',
    category: 'Style',
    readMinutes: 5,
    content: [
      'A luxury watch is one of the few gifts that is both practical and deeply personal. Begin with lifestyle: active professionals may prefer durable steel and water resistance, while evening wear calls for slimmer profiles and classic dials.',
      'Consider case size relative to wrist size, many of our ladies collections are designed for smaller wrists without sacrificing presence. Quartz movements offer reliability; automatic pieces appeal to collectors who enjoy craftsmanship.',
      'Colour sets the tone. Gold and rose gold read warm and celebratory; silver and black feel modern and versatile. For couples, matching sets create a story you can both wear.',
      'Finally, plan for presentation: gift boxes, engraving, and a short note elevate the unboxing moment. Visit our watch collection online or WhatsApp us for curated picks by budget.',
    ],
  },
  {
    slug: 'bespoke-personalization-engraving',
    title: 'Bespoke Personalization: Why Custom Engraving Matters',
    excerpt:
      'Names, dates, and messages transform standard products into heirlooms. Here is what to know before you customize.',
    image: '/products/product_4.jpeg',
    author: 'Vegas Gift Shop Team',
    date: '2026-03-15',
    category: 'Personalization',
    readMinutes: 4,
    content: [
      'Engraving adds emotional weight. A flask with a retirement date, a diary with a company motto, or a necklace with a loved one’s name becomes something they keep, not something they replace.',
      'Proof every detail before production: spelling, capitalization, and special characters. For logos, vector artwork (PDF or AI) produces the cleanest results on metal, glass, and leather.',
      'Allow lead time. Custom work ships after production, typically one to three extra business days depending on complexity and volume.',
      'Whether you are ordering one piece or five hundred, our team confirms artwork on WhatsApp so your gift arrives exactly as you imagined.',
    ],
  },
  {
    slug: 'same-day-gift-delivery-nairobi',
    title: 'Same-Day Gift Delivery in Nairobi: What You Need to Know',
    excerpt:
      'Last-minute plans? Here is how we deliver surprises across Nairobi when timing is everything.',
    image: '/hero.png',
    author: 'Vegas Gift Shop Team',
    date: '2026-02-20',
    category: 'Delivery',
    readMinutes: 4,
    content: [
      'Same-day delivery works best with in-stock items and orders placed before our daily cut-off. Custom engraving may need an extra day, message us first if you are on a tight deadline.',
      'Provide a accurate phone number and delivery instructions: office reception, gate codes, and preferred time windows help couriers find your recipient quickly.',
      'Popular same-day picks include jewelry, drinkware, gift sets, and cards. We will confirm availability instantly on WhatsApp.',
    ],
  },
  {
    slug: 'romantic-gifts-that-feel-personal',
    title: 'Romantic Gifts That Feel Personal (Not Generic)',
    excerpt:
      'Move beyond generic chocolates with keepsakes they will display, wear, or use daily.',
    image: '/gifts for women 1.jpg',
    author: 'Vegas Gift Shop Team',
    date: '2026-02-08',
    category: 'Romance',
    readMinutes: 5,
    content: [
      'The best romantic gifts reflect shared history: a pendant with coordinates of where you met, a watch engraved with your anniversary, or a journal with a message inside the cover.',
      'Presentation counts, gift wrapping, a handwritten card, and delivery to their workplace or home at the right moment turn a product into a story.',
      'Browse our romantic and jewelry collections, or tell us your budget and we will suggest three options you can approve in minutes.',
    ],
  },
  {
    slug: 'awards-trophies-employee-recognition',
    title: 'Awards & Trophies: Recognizing Teams the Right Way',
    excerpt:
      'Crystal, acrylic, and wooden awards that communicate prestige and gratitude at company events.',
    image: '/products/product_3.jpeg',
    author: 'Vegas Gift Shop Team',
    date: '2026-01-22',
    category: 'Corporate',
    readMinutes: 5,
    content: [
      'Recognition programs retain talent and reinforce culture. Match award tier to achievement: crystal stars for top sales, wooden plaques for service years, and acrylic pieces for team milestones.',
      'Include the recipient name, department, and achievement line. UV branding and laser engraving stay crisp for years on display shelves.',
      'Order early for AGMs and end-of-year events, bulk corporate orders benefit from consolidated proofs and scheduled delivery.',
    ],
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
