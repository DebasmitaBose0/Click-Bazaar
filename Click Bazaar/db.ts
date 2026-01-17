
import { Product, ProductCategory, User, UserRole, Order, OrderStatus } from './types';

const DB_KEY = 'clickbazaar_db_v2.2';

interface DBState {
  users: User[];
  products: Product[];
  orders: Order[];
  currentUser: User | null;
}

const INITIAL_STATE: DBState = {
  users: [
    { id: '1', name: 'Admin User', email: 'admin@clickbazaar.com', role: UserRole.ADMIN, password: '[TEST_PLACEHOLDER]' },
    { id: '2', name: 'Test Customer', email: 'customer@test.com', role: UserRole.CUSTOMER, password: '[TEST_PLACEHOLDER]' }
  ],
  products: ([
    // Men's Wear (5 Items)
    { id: 'mw1', name: 'Tailored Linen Blazer', category: ProductCategory.MENS_WEAR, price: 4999, stock: 20, description: 'Premium slim-fit linen blazer in sandstone beige.', image: 'https://frenchcrown.in/cdn/shop/products/BL2260-SB-PP_1.jpg?v=1700648066&width=3600' },
    { id: 'mw2', name: 'Indigo Oxford Shirt', category: ProductCategory.MENS_WEAR, price: 1899, stock: 45, description: 'Classic oxford weave cotton shirt with button-down collar.', image: 'https://www.thestiffcollar.com/cdn/shop/files/DENIMDARKBLUE_3.jpg?v=1764082965&width=1300' },
    { id: 'mw3', name: 'Raw Selvedge Denim', category: ProductCategory.MENS_WEAR, price: 3299, stock: 30, description: 'Heavyweight indigo denim that fades uniquely over time.', image: 'https://denimhunters.com/wp-content/uploads/LVC-1947-501XX-1024x1024.jpg' },
    { id: 'mw4', name: 'Merino Wool Polo', category: ProductCategory.MENS_WEAR, price: 2499, stock: 25, description: 'Fine-knit merino wool for a sophisticated casual look.', image: 'https://www.fashiola.in/product-list/120382040.webp' },
    { id: 'mw5', name: 'Classic Chino Shorts', category: ProductCategory.MENS_WEAR, price: 1299, stock: 50, description: 'Comfortable cotton twill chinos in navy blue.', image: 'https://images.napali.app/global/element-products/all/default/xlarge/elyws00104_element,f_kha_frt1.jpg' },

    // Women's Wear (5 Items)
    { id: 'ww1', name: 'Silk Wrap Midi Dress', category: ProductCategory.WOMENS_WEAR, price: 3499, stock: 15, description: 'Elegant mulberry silk wrap dress in emerald green.', image: 'https://1861.ca/cdn/shop/files/akamari-ES-1.jpg?v=1717530479&width=2048' },
    { id: 'ww2', name: 'Cashmere Oversized Sweater', category: ProductCategory.WOMENS_WEAR, price: 5999, stock: 10, description: 'Ultra-soft grade A cashmere sweater for cozy luxury.', image: 'https://m.media-amazon.com/images/I/61asxzpEoTL._AC_UY1000_.jpg' },
    { id: 'ww3', name: 'High-Waist Wide Leg Jeans', category: ProductCategory.WOMENS_WEAR, price: 2799, stock: 25, description: 'Vintage-inspired denim with a modern flattering silhouette.', image: 'https://assets.ajio.com/medias/sys_master/root/20230912/ARsa/65005191afa4cf41f5dd608d/-1117Wx1400H-441945793-blue-MODEL.jpg' },
    { id: 'ww4', name: 'Tailored Satin Blazer', category: ProductCategory.WOMENS_WEAR, price: 4299, stock: 20, description: 'Sharp-shouldered satin blazer in midnight black.', image: 'https://media.neimanmarcus.com/f_auto,q_auto:low,ar_4:5,c_fill,dpr_2.0,w_790/01/nm_4662356_100550_m' },
    { id: 'ww5', name: 'Floral Chiffon Maxi', category: ProductCategory.WOMENS_WEAR, price: 3899, stock: 18, description: 'Hand-painted floral print chiffon for garden events.', image: 'https://i.pinimg.com/736x/04/bf/10/04bf1054e2431bfe798bea4eaa24154d.jpg' },

    // Kids' Wear (5 Items)
    { id: 'kw1', name: 'Organic Cotton Romper', category: ProductCategory.KIDS_WEAR, price: 999, stock: 60, description: 'GOTS certified organic cotton for sensitive baby skin.', image: 'https://www.momshome.in/cdn/shop/files/romper_mockups._lemon_front.jpg?v=1765350971' },
    { id: 'kw2', name: 'Graphic Dinosaur Tee', category: ProductCategory.KIDS_WEAR, price: 599, stock: 100, description: 'Fun interactive print on soft combed cotton.', image: 'https://m.media-amazon.com/images/I/81GeJH87rfL._AC_UY1100_.jpg' },
    { id: 'kw3', name: 'Denim Dungaree Set', category: ProductCategory.KIDS_WEAR, price: 1499, stock: 35, description: 'Durable denim dungarees paired with a striped tee.', image: 'https://m.media-amazon.com/images/I/719x0Dnx68L._AC_UY1100_.jpg' },
    { id: 'kw4', name: 'Tulle Party Dress', category: ProductCategory.KIDS_WEAR, price: 2199, stock: 20, description: 'Sparkly tulle layers with a satin bow for special days.', image: 'https://nakshatrakids.com/cdn/shop/files/www.nakshatrakids.com527801.webp?v=1757841167&width=1946' },
    { id: 'kw5', name: 'Puffer Winter Jacket', category: ProductCategory.KIDS_WEAR, price: 2599, stock: 25, description: 'Lightweight down-filled jacket for ultimate warmth.', image: 'https://m.media-amazon.com/images/I/51cSYQ426wL._AC_UY1100_.jpg' },

    // Men's Watches (5 Items)
    { id: 'mwa1', name: 'Silver Chronograph Elite', category: ProductCategory.MENS_WATCHES, price: 12500, stock: 12, description: 'Stainless steel timepiece with sapphire glass and automatic movement.', image: 'https://m.media-amazon.com/images/I/615wOT8l2dL._AC_UY350_.jpg' },
    { id: 'mwa2', name: 'Titanium Diver Pro', category: ProductCategory.MENS_WATCHES, price: 18900, stock: 8, description: '200m water resistance with helium escape valve.', image: 'https://cdn1.ethoswatches.com/media/catalog/product/cache/6e5de5bc3d185d8179cdc7258143f41a/v/i/victorinox-dive-pro-241995-multiple-3.jpg' },
    { id: 'mwa3', name: 'Leather Heritage Classic', category: ProductCategory.MENS_WATCHES, price: 8500, stock: 15, description: 'Italian leather strap with a minimalist cream dial.', image: 'https://watchempires.com/cdn/shop/files/longines_heritage_classic_l478_1728463141_9381d524_progressive_grande.jpg?v=1728524951' },
    { id: 'mwa4', name: 'Smart Graphite Sport', category: ProductCategory.MENS_WATCHES, price: 15999, stock: 25, description: 'OLED display with advanced health and GPS tracking.', image: 'https://www.gosupps.com/media/catalog/product/cache/25/image/1500x/040ec09b1e35df139433887a97daa66f/7/1/716dMImEeSL._AC_SL1500_.jpg' },
    { id: 'mwa5', name: 'Skeleton Automatic Gold', category: ProductCategory.MENS_WATCHES, price: 25000, stock: 5, description: 'Exposed movement architecture with 18k gold plating.', image: 'https://finebuy.co.in/wp-content/uploads/2024/05/fossil-auto1.webp' },

    // Women's Watches (5 Items)
    { id: 'wwa1', name: 'Rose Gold Mesh Classic', category: ProductCategory.WOMENS_WATCHES, price: 6500, stock: 30, description: 'Elegance redefined with a magnetic mesh strap.', image: 'https://www.carlington.in/cdn/shop/files/Carlington_elite_analog_ladies_watch_CT_2007_roseold.jpg?v=1696689630&width=2400' },
    { id: 'wwa2', name: 'Petite Diamond Accents', category: ProductCategory.WOMENS_WATCHES, price: 12900, stock: 15, description: 'Small 24mm dial with authentic diamond hour markers.', image: 'https://images-cdn.ubuy.co.in/6694063943a203306206160a-women-s-watch-love-diamond-gift-gift.jpg' },
    { id: 'wwa3', name: 'Ceramic White Lux', category: ProductCategory.WOMENS_WATCHES, price: 15500, stock: 10, description: 'Scratch-resistant high-tech ceramic in pearl white.', image: 'https://m.media-amazon.com/images/I/71SMYZ2xXLL._AC_UY350_.jpg' },
    { id: 'wwa4', name: 'Floral Dial Leather', category: ProductCategory.WOMENS_WATCHES, price: 4200, stock: 40, description: 'Delicate hand-painted dial with soft pastel strap.', image: 'https://www.buyhautesauce.com/cdn/shop/products/SS22_HSWC1035_1.jpg?v=1659008814' },
    { id: 'wwa5', name: 'Silver Bangle Watch', category: ProductCategory.WOMENS_WATCHES, price: 8900, stock: 20, description: 'Timepiece that doubles as a sophisticated jewelry piece.', image: 'https://waldorandco.com/cdn/shop/files/IMG_14627.jpg?v=1731600264&width=767' },

    // Electronics (9 Items)
    { id: 'e1', name: 'Quantum Noise Cancelling Headphones', category: ProductCategory.ELECTRONICS, price: 18999, stock: 40, description: 'Industry-leading noise cancellation with 40h battery life.', image: 'https://inventstore.in/wp-content/uploads/2023/04/iPhone_13_Blue.webp' },
    { id: 'e2', name: 'Studio Hi-Fi Speaker', category: ProductCategory.ELECTRONICS, price: 12500, stock: 20, description: 'Room-filling audio with wooden cabinet design.', image: 'https://mixingmonster.com/wp-content/uploads/2024/11/blog-studio-gear-best-hifi-speakers-elac-bs2434-sb-carina.webp'},
    { id: 'e3', name: 'Mechanical RGB Keyboard', category: ProductCategory.ELECTRONICS, price: 8999, stock: 35, description: 'Cherry MX Blue switches with per-key lighting.', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&h=500&fit=crop' },
    { id: 'e4', name: 'Precision Wireless Mouse', category: ProductCategory.ELECTRONICS, price: 4500, stock: 50, description: 'Ergonomic design with 26k DPI optical sensor.', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop' },
    { id: 'e5', name: 'Ultra-Thin 4K Tablet', category: ProductCategory.ELECTRONICS, price: 45000, stock: 15, description: '12.9-inch OLED display with stylus support.', image: 'https://www.designinfo.in/wp-content/uploads/2023/01/Apple-iPhone-14-Pro-Mobile-Phone-493177786-i-1-1200Wx1200H-optimized.jpeg' },
    { id: 'e6', name: 'Mirrorless Pro Camera', category: ProductCategory.ELECTRONICS, price: 125000, stock: 10, description: 'Full-frame sensor with 4K 60fps video capabilities.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop' },
    { id: 'e7', name: 'Curved Gaming Monitor', category: ProductCategory.ELECTRONICS, price: 32000, stock: 12, description: '34-inch ultrawide with 144Hz refresh rate.', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop' },
    { id: 'e9', name: 'Smart Home Soundbar', category: ProductCategory.ELECTRONICS, price: 21000, stock: 18, description: 'Dolby Atmos support with wireless subwoofer.', image: 'https://static.skyassets.com/contentstack/assets/blt143e20b03d72047e/blt03e263d18eb1b8b9/68c0ca8d53f9157237149f80/2025_Q3_Sep_Apple_Launch_Keynote_Phase_1_Brand_Hub_Apple_at_Sky_Pro_and_Max_Product_Card._(1).png' },
    { id: 'e10', name: 'MagSafe Power Bank', category: ProductCategory.ELECTRONICS, price: 3999, stock: 60, description: '10000mAh portable charger with wireless magnetic snap.', image: 'https://i.insider.com/5df10d81fd9db229ba736a77?width=700' },

    // Grocery (5 Items)
    { id: 'g1', name: 'Artisanal Coffee Blend', category: ProductCategory.GROCERY, price: 850, stock: 100, description: 'Dark roast Arabica beans sourced from Coorg estates.', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop' },
    { id: 'g2', name: 'Organic Cold-Pressed Oil', category: ProductCategory.GROCERY, price: 1200, stock: 50, description: 'Extra virgin olive oil from Mediterranean groves.', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop' },
    { id: 'g3', name: 'Premium California Almonds', category: ProductCategory.GROCERY, price: 950, stock: 80, description: 'Lightly roasted and salted jumbo almonds.', image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&h=500&fit=crop' },
    { id: 'g4', name: 'Exotic Darjeeling Tea', category: ProductCategory.GROCERY, price: 650, stock: 120, description: 'First-flush loose leaf tea with floral notes.', image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&h=500&fit=crop' },
    { id: 'g5', name: 'Dark Chocolate 85%', category: ProductCategory.GROCERY, price: 450, stock: 150, description: 'Single-origin cocoa bars from sustainable farms.', image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&h=500&fit=crop' },

    // Mobile (5 Items)
    { id: 'mob1', name: 'iPhone 15 Pro Max', category: ProductCategory.MOBILE, price: 159900, stock: 15, description: 'Titanium design, A17 Pro chip, and the most powerful iPhone camera system ever.', image: 'https://www.imagineonline.store/cdn/shop/files/iPhone_15_Pink_PDP_Image_Position-1__en-IN.jpg?v=1759733974&width=1445' },
    { id: 'mob2', name: 'Samsung Galaxy S24 Ultra', category: ProductCategory.MOBILE, price: 129999, stock: 12, description: 'The ultimate Galaxy Ultra experience with Galaxy AI and built-in S Pen.', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop' },
    { id: 'mob3', name: 'Google Pixel 8 Pro', category: ProductCategory.MOBILE, price: 106999, stock: 8, description: 'The all-pro Google phone with the best Pixel Camera yet.', image: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Pixel_Portfolio_Bay_Hazel_vZb6KiW.width-1300.jpg' },
    { id: 'mob4', name: 'OnePlus 12', category: ProductCategory.MOBILE, price: 64999, stock: 20, description: 'Smooth Beyond Belief. Powered by Snapdragon 8 Gen 3.', image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=500&h=500&fit=crop' },
    { id: 'mob5', name: 'Nothing Phone (2)', category: ProductCategory.MOBILE, price: 44999, stock: 25, description: 'A new way to interact. Featuring the iconic Glyph Interface.', image: 'https://acko-cms.ackoassets.com/Nothing_Phone_2_2_9da103def9.jpg' },

    // Home (5 Items)
    { id: 'hm1', name: 'Smart Ambient Floor Lamp', category: ProductCategory.HOME, price: 4500, stock: 25, description: '16 million colors with voice control and music sync.', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop' },
    { id: 'hm2', name: 'Minimalist Ceramic Vase Set', category: ProductCategory.HOME, price: 1800, stock: 30, description: 'Handcrafted matte ceramic vases for a modern aesthetic.', image: 'https://u-mercari-images.mercdn.net/photos/m41048079716_3.jpg' },
    { id: 'hm3', name: 'Ergonomic Mesh Office Chair', category: ProductCategory.HOME, price: 12500, stock: 15, description: 'High-back mesh chair with adjustable lumbar support.', image: 'https://m.media-amazon.com/images/I/61WXh60JiqL.jpg' },
    { id: 'hm4', name: 'Robot Vacuum Cleaner Pro', category: ProductCategory.HOME, price: 24999, stock: 10, description: 'Lidar navigation with auto-empty station and mopping.', image: 'https://www.eurekaforbes.com/cms/assets/prod/GFCDFRCLNP_0000_1_b451b19bd7.jpg' },
    { id: 'hm5', name: 'HEPA Air Purifier 4', category: ProductCategory.HOME, price: 8999, stock: 20, description: 'Purifies 20m² room in 10 minutes. Quiet operation.', image: 'https://media.versacdn.com/media/wordpress/036710d12bf173b77dcd3493cfe9c60b.jpg' },

    // Beauty (5 Items)
    { id: 'bt1', name: 'Vitamin C Brightening Serum', category: ProductCategory.BEAUTY, price: 899, stock: 100, description: '15% stabilized Vitamin C for radiant, even skin tone.', image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcT2HMaYnmQ4oagfK094WcIPwkCV-azZRZRRJXbw_-0KBjpMnPTR0WjU-OlWMBaxrarNinEI8hJVcrmEFD7zmb0ZmyLV8kRjkf53BkH3TNzoW5p9qThSUyxx' },
    { id: 'bt2', name: 'Matte Liquid Lipstick - Crimson', category: ProductCategory.BEAUTY, price: 650, stock: 150, description: '12-hour wear smudge-proof bold red matte finish.', image: 'https://m.media-amazon.com/images/I/41fYE9w-WmL.jpg' },
    { id: 'bt3', name: 'Volumizing Waterproof Mascara', category: ProductCategory.BEAUTY, price: 499, stock: 200, description: 'Dramatic volume that stays put all day and night.', image: 'https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/americas/us/eye-makeup/mascara/volum-express-the-colossal-waterproof-mascara/maybelline-mascara-colossal-waterproof-classic-black-041554197044-o.jpg?rev=4dca4672064f4be9bcfb24e900f6c111'},
    { id: 'bt5', name: 'Ultra-Light Sunscreen SPF 50', category: ProductCategory.BEAUTY, price: 599, stock: 180, description: 'No white cast, non-greasy formula for daily protection.', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=500&fit=crop' },
    { id: 'bt10', name: 'Luxury Midnight Perfume Mist', category: ProductCategory.BEAUTY, price: 3200, stock: 25, description: 'Enchanting notes of jasmine, patchouli, and vanilla.', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop' },
  ] as any[]).map(p => {
    let categoryFaqs = [];
    let categoryReviews = [];
    
    switch(p.category) {
        case ProductCategory.MOBILE:
        case ProductCategory.ELECTRONICS:
            categoryFaqs = [
                { question: 'Does this come with a warranty?', answer: 'Yes, it comes with a 1-year official manufacturer warranty covering all manufacturing defects.' },
                { question: 'Is the packaging damage-proof?', answer: 'We use secure, shock-proof packaging with protective layers for all electronics.' },
                { question: 'What is the return window?', answer: 'You can return within 30 days of purchase for a full refund.' }
            ];
            categoryReviews = [
                { id: 'r1', userName: 'Alex M.', rating: 5, comment: 'Outstanding performance! Exactly as described. Worth every penny!', date: '2024-01-02' },
                { id: 'r2', userName: 'Jordan K.', rating: 5, comment: 'Fast delivery, excellent packaging, product works perfectly.', date: '2024-01-03' },
                { id: 'r3', userName: 'Casey T.', rating: 4, comment: 'Great product. Took 2 days to arrive. Very satisfied.', date: '2024-01-04' },
                { id: 'r4', userName: 'Morgan S.', rating: 5, comment: 'Best purchase I made this year. Highly recommend!', date: '2023-12-30' }
            ];
            break;
        case ProductCategory.MENS_WEAR:
        case ProductCategory.WOMENS_WEAR:
        case ProductCategory.KIDS_WEAR:
            categoryFaqs = [
                { question: 'How do I choose the right size?', answer: 'Please refer to our detailed size chart. Measure your bust/waist and compare with our measurements.' },
                { question: 'Is the fabric shrink-resistant?', answer: 'Yes, all our fabrics are pre-shrunk and treated to resist shrinkage after washing.' },
                { question: 'What is the fabric composition?', answer: 'Each product specifies its material. Most are 100% natural fibers or high-quality blends.' },
                { question: 'How should I care for this item?', answer: 'Check the care tag for washing instructions. Most items are machine washable in cold water.' }
            ];
            categoryReviews = [
                { id: 'r1', userName: 'Sam P.', rating: 5, comment: 'Perfect fit! Great quality fabric and amazing value for money.', date: '2024-01-02' },
                { id: 'r2', userName: 'Riley N.', rating: 5, comment: 'Love the design. The color is exactly as shown. Very comfortable!', date: '2024-01-01' },
                { id: 'r3', userName: 'Dakota L.', rating: 4, comment: 'Good quality. Fits true to size. Will buy more.', date: '2023-12-29' },
                { id: 'r4', userName: 'Taylor R.', rating: 5, comment: 'Excellent quality. Arrived faster than expected.', date: '2023-12-25' }
            ];
            break;
        case ProductCategory.BEAUTY:
            categoryFaqs = [
                { question: 'Is this product suitable for sensitive skin?', answer: 'Yes, it is dermatologically tested, hypoallergenic, and safe for all skin types.' },
                { question: 'Is it cruelty-free?', answer: 'Absolutely! We do not test on animals and use only ethical sources.' },
                { question: 'What is the shelf life?', answer: 'Our products have a 3-year shelf life from manufacturing date when stored properly.' },
                { question: 'Are there any harmful chemicals?', answer: 'No. All our products are made with natural and safe ingredients. Check ingredients list for specifics.' }
            ];
            categoryReviews = [
                { id: 'r1', userName: 'Alex G.', rating: 5, comment: 'My skin has never looked better! Natural, effective, and affordable.', date: '2024-01-03' },
                { id: 'r2', userName: 'Jordan H.', rating: 5, comment: 'No irritation, works as promised. Amazing product!', date: '2024-01-02' },
                { id: 'r3', userName: 'Casey B.', rating: 4, comment: 'Good results. Takes a few days to see the difference.', date: '2023-12-31' },
                { id: 'r4', userName: 'Morgan W.', rating: 5, comment: 'Best beauty product I have tried. Highly recommended.', date: '2023-12-28' }
            ];
            break;
        case ProductCategory.HOME:
            categoryFaqs = [
                { question: 'Is assembly required?', answer: 'Most items come partially assembled. Full assembly instructions are included.' },
                { question: 'What is the durability?', answer: 'All our home products are built to last 5+ years with proper care.' },
                { question: 'Do you offer installation service?', answer: 'For large items, we offer paid installation service in select cities.' },
                { question: 'What is the warranty period?', answer: 'Most items come with a 2-year manufacturer warranty.' }
            ];
            categoryReviews = [
                { id: 'r1', userName: 'Sam T.', rating: 5, comment: 'Perfect addition to my home. Quality is outstanding!', date: '2024-01-03' },
                { id: 'r2', userName: 'Riley D.', rating: 5, comment: 'Assembly was easy. Looks great and feels solid.', date: '2024-01-02' },
                { id: 'r3', userName: 'Dakota M.', rating: 4, comment: 'Good quality. Instructions could be clearer.', date: '2023-12-30' },
                { id: 'r4', userName: 'Taylor C.', rating: 5, comment: 'Exceeded my expectations. Great value!', date: '2023-12-27' }
            ];
            break;
        case ProductCategory.GROCERY:
            categoryFaqs = [
                { question: 'Are the products organic?', answer: 'Most of our grocery items are organic or naturally sourced. Check product description for details.' },
                { question: 'What is the expiry date?', answer: 'All products are fresh with expiry dates at least 6 months away at the time of dispatch.' },
                { question: 'How are items packaged?', answer: 'Items are packaged in food-safe, eco-friendly materials to maintain freshness.' },
                { question: 'Do you offer bulk discounts?', answer: 'Yes! Bulk orders of 5+ items qualify for special discounts.' }
            ];
            categoryReviews = [
                { id: 'r1', userName: 'Alex F.', rating: 5, comment: 'Fresh and delicious! Exactly what I ordered. Will buy again!', date: '2024-01-02' },
                { id: 'r2', userName: 'Jordan V.', rating: 5, comment: 'Premium quality. Great taste and value.', date: '2024-01-01' },
                { id: 'r3', userName: 'Casey P.', rating: 4, comment: 'Good quality. Packaging kept everything fresh.', date: '2023-12-29' },
                { id: 'r4', userName: 'Morgan E.', rating: 5, comment: 'Best grocery products online. Highly recommend!', date: '2023-12-26' }
            ];
            break;
        case ProductCategory.MENS_WATCHES:
        case ProductCategory.WOMENS_WATCHES:
            categoryFaqs = [
                { question: 'Is the watch water-resistant?', answer: 'Yes, all our watches have water resistance suitable for daily wear (check specific rating).' },
                { question: 'What is the battery life?', answer: 'Battery lasts 2-3 years depending on watch type. Free battery replacement available.' },
                { question: 'Can I get it engraved?', answer: 'Yes! We offer free engraving on the back case of watches.' },
                { question: 'Is there a warranty?', answer: 'Yes, 2-year official warranty covering all manufacturing defects.' }
            ];
            categoryReviews = [
                { id: 'r1', userName: 'Sam J.', rating: 5, comment: 'Stunning design! Keeps perfect time. Highly satisfied!', date: '2024-01-02' },
                { id: 'r2', userName: 'Riley K.', rating: 5, comment: 'Beautiful watch. Arrives in elegant packaging. Worth it!', date: '2024-01-01' },
                { id: 'r3', userName: 'Dakota S.', rating: 4, comment: 'Great watch. Band took a few days to adjust comfortably.', date: '2023-12-30' },
                { id: 'r4', userName: 'Taylor M.', rating: 5, comment: 'Excellent timepiece. Perfect gift. Highly recommended.', date: '2023-12-28' }
            ];
            break;
        default:
            categoryFaqs = [
                { question: 'What is the return policy?', answer: 'We offer a 30-day no-questions-asked return policy for all items.' }
            ];
            categoryReviews = [
                { id: 'r1', userName: 'Customer A', rating: 5, comment: 'Great product!', date: '2024-01-02' }
            ];
    }

    return {
        ...p,
        deliveryDate: 'Est. Delivery: Tue, Jan 09',
        features: ['Premium Quality', 'Verified Authentic', 'Best Seller', 'Free Shipping'],
        faqs: [
            ...categoryFaqs,
            { question: 'How long does shipping take?', answer: 'Standard shipping is 3-5 business days. Express is 1-2 days.' }
        ],
        reviews: categoryReviews
    };
  }),
  orders: [],
  currentUser: null
};

export const getDB = (): DBState => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Validate that products have the new properties
      if (parsed.products && parsed.products[0] && parsed.products[0].faqs) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
  // Always return fresh INITIAL_STATE if data is missing or invalid
  return INITIAL_STATE;
};

export const saveDB = (state: DBState) => {
  localStorage.setItem(DB_KEY, JSON.stringify(state));
};

export const clearDB = () => {
  // Clear all Click Bazaar related localStorage entries
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('clickbazaar_')) {
      localStorage.removeItem(key);
    }
  });
  window.location.reload();
};
