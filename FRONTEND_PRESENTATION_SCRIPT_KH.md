# ស្គ្រីបពន្យល់អំពី Frontend របស់ Smart Market

ឯកសារនេះជាស្គ្រីបខ្លីសម្រាប់ពន្យល់ទៅគ្រូអំពី frontend របស់ project Smart Market។ Project នេះប្រើ React, Vite, Apollo Client, GraphQL, Material UI និង SCSS ដើម្បីបង្កើត user interface សម្រាប់ប្រព័ន្ធគ្រប់គ្រងហាង, POS, stock, warehouse និង reports។

## 1. សង្ខេបបច្ចេកវិទ្យា Frontend

Frontend របស់ project នេះបង្កើតឡើងដោយប្រើ៖

- `React` សម្រាប់បង្កើត UI ជា components។
- `Vite` សម្រាប់ development server និង build project។
- `React Router` សម្រាប់ routing ទៅ pages ផ្សេងៗ។
- `Apollo Client` សម្រាប់ភ្ជាប់ frontend ទៅ backend GraphQL API។
- `Material UI` និង icon libraries សម្រាប់ UI components។
- `SCSS/CSS` សម្រាប់ styling។
- `ApexCharts` និង `Recharts` សម្រាប់ dashboard charts និង reports។
- `Formik` និង `Yup` សម្រាប់ form handling និង validation។
- `Supabase` សម្រាប់ image/file storage។
- `localStorage` សម្រាប់រក្សា token, user data និង language setting។

## 2. Frontend Architecture

Frontend ត្រូវបានរៀបចំជា folders សំខាន់ៗ៖

- `src/Pages`: ទុក pages សំខាន់ៗដូចជា Dashboard, POS, Product, Warehouse, Report, Customer, Supplier, User និង Login។
- `src/Components`: ទុក reusable components សម្រាប់ form, action buttons, dialogs, POS cart, warehouse transfer, purchase order និង table management។
- `src/Context`: ទុក global state ដូចជា authentication និង theme។
- `src/Menu`: ទុក sidebar, top navbar និង mobile menu។
- `src/Styles`: ទុក SCSS/CSS សម្រាប់ page styling។
- `graphql`: ទុក GraphQL queries និង mutations។
- `apolloClient.js`: កំណត់ GraphQL client, authorization header និង error handling។

ការរៀបចំបែបនេះធ្វើឱ្យ code អាចថែទាំបានងាយ ព្រោះ UI ត្រូវបានបំបែកជា pages, components, context និង API layer។

## 3. Routing និង Pages

Routing ស្ថិតនៅក្នុង `src/Router.jsx`។ ប្រសិនបើ user មិនទាន់ login វាបង្ហាញតែ Login page។ បើ user login រួច វាបង្ហាញ layout និង pages សំខាន់ៗ។

Pages សំខាន់ៗមាន៖

- `Dashboard`: បង្ហាញស្ថិតិ និង overview របស់ប្រព័ន្ធ។
- `DashboardInShop`: dashboard សម្រាប់ហាងជាក់លាក់។
- `Pos`: ទំព័រលក់ទំនិញ និងគ្រប់គ្រង order។
- `Store`: ទំព័រគ្រប់គ្រងហាង។
- `Warehouse`: គ្រប់គ្រង main warehouse, purchase order, stock transfer និង warehouse request។
- `WarehouseInShop`: គ្រប់គ្រង stock នៅក្នុងហាង។
- `Product`: គ្រប់គ្រង products និង sub products។
- `Category`, `Unit`, `Supplier`, `Customer`, `Table`: setting data សម្រាប់ business។
- `User`: គ្រប់គ្រងអ្នកប្រើប្រាស់។
- `Report` និង `ReportInShop`: បង្ហាញ reports សម្រាប់ sales, inventory និង finance។
- `Profile`: បង្ហាញ និងកែប្រែ profile។
- `ChatBot`: ទំព័រ AI chat assistant។

## 4. Authentication និង Security

Frontend មាន `AuthContext` នៅក្នុង `src/Context/AuthContext.jsx`។

វាគ្រប់គ្រង៖

- token របស់ user។
- user information។
- login និង logout។
- language setting។
- alert message។
- token expiration checking។
- auto logout ប្រសិនបើ token ផុតកំណត់។

Token ត្រូវបានរក្សាទុកក្នុង `localStorage`។ នៅពេល frontend call GraphQL API, `apolloClient.js` នឹងយក token នោះដាក់ក្នុង request header ជា៖

```text
Authorization: Bearer <token>
```

បើ backend ត្រឡប់ error `UNAUTHENTICATED`, frontend នឹង clear token និង user data ហើយ logout user ដោយស្វ័យប្រវត្តិ។

## 5. GraphQL Connection

Frontend ភ្ជាប់ទៅ backend តាម `Apollo Client` នៅក្នុង `apolloClient.js`។

API URL ត្រូវបានយកពី environment variable៖

```text
VITE_BACKEND_API_URL
```

Frontend ប្រើ GraphQL queries និង mutations ដើម្បី៖

- login user។
- create/update/delete products។
- create sales។
- receive purchase orders។
- transfer stock។
- request stock។
- query dashboard data។
- query reports។
- query customers, suppliers, units, categories, tables និង users។

នេះមានន័យថា frontend មិន access database ដោយផ្ទាល់ទេ។ Frontend communicate ជាមួយ backend តាម GraphQL API ប៉ុណ្ណោះ។

## 6. Main User Workflow

Workflow សំខាន់ៗរបស់ frontend មាន៖

1. User login នៅ Login page។
2. Frontend រក្សា JWT token និង user data។
3. User ចូលទៅ Dashboard ដើម្បីមើល summary។
4. User អាចបង្កើត shop, product, category, unit, supplier និង customer។
5. User អាចចូល POS page ដើម្បីលក់ទំនិញ។
6. ពេលលក់ទំនិញ Frontend call `createSale` mutation ទៅ backend។
7. Backend update stock ហើយ frontend បង្ហាញលទ្ធផលឱ្យ user។
8. User អាចមើល warehouse stock, transfer stock, receive purchase order និង reports។

Workflow នេះបង្ហាញថា frontend គឺជា interface សម្រាប់ user ធ្វើការជាមួយ business data ដោយមាន backend ជាអ្នកគ្រប់គ្រង logic និង database។

## 7. POS Page

`Pos` page ជាផ្នែកសំខាន់សម្រាប់ការលក់។ វាមាន components ដូចជា៖

- Product list។
- Cart panel។
- Payment dialog។
- Sale history។
- Recent orders។
- Barcode scanner។
- Pending invoice។

នៅពេល cashier ជ្រើសផលិតផល, frontend បញ្ចូលវាទៅ cart។ ពេល checkout, frontend ផ្ញើ sale data ទៅ backend តាម GraphQL mutation។ Backend គណនា និង update stock ហើយ frontend បង្ហាញ status ឱ្យ user។

## 8. Warehouse និង Stock Management UI

Frontend មាន pages និង components សម្រាប់ stock management ដូចជា៖

- Main warehouse stock។
- Shop warehouse stock។
- Adjust stock form។
- Product transfer form។
- Accept transfer dialog។
- Warehouse request form។
- Purchase order form។
- Purchase order receive screen។
- Stock movement history។

UI ផ្នែកនេះជួយ user គ្រប់គ្រង stock ពី supplier ទៅ warehouse, ពី warehouse ទៅ shop និងពី shop ទៅការលក់។

## 9. Reports និង Dashboard

Dashboard និង Report pages ប្រើ GraphQL queries ដើម្បីទាញ data ដែល backend calculate រួច។

Frontend បង្ហាញ៖

- sales summary។
- revenue chart។
- recent transactions។
- product statistics។
- inventory report។
- purchase report។
- supplier report។
- customer report។
- tax report។
- profit and loss report។
- annual report។

Charts ត្រូវបានបង្កើតដោយ chart libraries ដូចជា `ApexCharts`, `React ApexCharts` និង `Recharts`។

## 10. UI/UX Features

Frontend មាន UI/UX features ដូចជា៖

- Sidebar navigation។
- Top navbar។
- Mobile menu។
- Theme customization។
- Alert messages។
- Empty data state។
- Loading state។
- Pagination footer។
- Dialog forms។
- Khmer និង English translation files។
- Image upload។
- Barcode rendering/scanning។

នេះធ្វើឱ្យប្រព័ន្ធងាយប្រើសម្រាប់ cashier, manager, admin និង stock controller។

## 11. អ្វីដែលខ្ញុំអាចឆ្លើយទៅគ្រូ

### Frontend ប្រើ technology អ្វីខ្លះ?

Frontend ប្រើ React ជាមួយ Vite, Apollo Client សម្រាប់ GraphQL, React Router សម្រាប់ routing, Material UI សម្រាប់ components, SCSS សម្រាប់ style និង chart libraries សម្រាប់ dashboard/reports។

### Frontend ភ្ជាប់ទៅ backend ដោយរបៀបណា?

Frontend ភ្ជាប់ទៅ backend តាម GraphQL API។ Apollo Client ផ្ញើ queries និង mutations ទៅ URL ដែលកំណត់ក្នុង `VITE_BACKEND_API_URL`។ Token របស់ user ត្រូវបានដាក់ក្នុង Authorization header។

### តើ frontend access database ដោយផ្ទាល់ទេ?

ទេ។ Frontend មិន access MongoDB ដោយផ្ទាល់ទេ។ Frontend call backend GraphQL API ហើយ backend ជាអ្នកធ្វើ validation, business logic និង database operations។

### តើ authentication ដំណើរការយ៉ាងដូចម្តេច?

ក្រោយពេល login, frontend រក្សា JWT token និង user data នៅក្នុង localStorage។ Apollo Client ដាក់ token ទៅ request header រាល់ពេល call API។ បើ token ផុតកំណត់ ឬ backend ប្រាប់ថា unauthenticated, frontend logout user ដោយស្វ័យប្រវត្តិ។

### តើ frontend មាន pages សំខាន់ៗអ្វីខ្លះ?

មាន Login, Dashboard, POS, Store, Warehouse, WarehouseInShop, Product, Category, Unit, Supplier, Customer, Table, User, Report, Profile និង ChatBot។

### តើ POS page ធ្វើអ្វី?

POS page អនុញ្ញាតឱ្យ cashier ជ្រើស product, បញ្ចូលទៅ cart, checkout, ជ្រើស payment method និងបង្កើត sale។ ពេល sale completed, backend នឹង update stock ហើយ frontend បង្ហាញ result ឱ្យ user។

### តើ frontend support report យ៉ាងដូចម្តេច?

Frontend មាន Report និង Dashboard pages ដែលទាញ data ពី backend ហើយបង្ហាញជា table, summary និង chart។ Reports រួមមាន sale, purchase, inventory, customer, supplier, tax, profit/loss និង annual report។

### តើ frontend design មានអ្វីពិសេស?

Frontend មាន sidebar navigation, top navbar, theme customization, alert messages, loading state, empty state, pagination, dialogs, Khmer/English language support និង responsive pages សម្រាប់ប្រើក្នុងហាង។

### តើអ្វីអាចកែលម្អបន្ថែម?

អាចបន្ថែម role-based route protection នៅ frontend ឱ្យច្បាស់ជាងមុន, បន្ថែម form validation ឱ្យគ្រប់ form, បន្ថែម testing, និង optimize performance ដោយ lazy loading pages ឬ caching strategy។

## 12. ស្គ្រីបខ្លីសម្រាប់ Presentation

Frontend របស់ project Smart Market ត្រូវបានបង្កើតដោយ React និង Vite។ វាប្រើ Apollo Client ដើម្បីភ្ជាប់ទៅ backend GraphQL API ហើយប្រើ React Router សម្រាប់បែងចែក pages ដូចជា Dashboard, POS, Warehouse, Product, Report និង Settings។

ប្រព័ន្ធមាន authentication ដោយប្រើ JWT token។ បន្ទាប់ពី user login, token ត្រូវបានរក្សាទុកក្នុង localStorage ហើយ Apollo Client ដាក់ token នោះទៅក្នុង Authorization header រាល់ request ទៅ backend។ បើ token ផុតកំណត់ ឬ user មិនមានសិទ្ធិ ប្រព័ន្ធអាច logout ដោយស្វ័យប្រវត្តិ។

Frontend មាន UI សម្រាប់ business workflows សំខាន់ៗ ដូចជា cashier លក់ទំនិញនៅ POS, admin គ្រប់គ្រង products/users/shops, stock controller គ្រប់គ្រង warehouse និង manager មើល dashboard/reports។ Frontend មិនប៉ះ database ដោយផ្ទាល់ទេ។ វាផ្ញើ queries និង mutations ទៅ backend ហើយ backend ជាអ្នកគ្រប់គ្រង database និង business logic។

ចំណុចខ្លាំងរបស់ frontend គឺវាបំបែក code ជា pages, components, context និង GraphQL layer ដូច្នេះងាយថែទាំ និងងាយពង្រីក។ វាក៏មាន Khmer/English language support, theme customization, alert messages, pagination, dialogs, charts និង POS interface ដែលសាកសមសម្រាប់ប្រព័ន្ធហាង។

## 13. សំណួរ និងចម្លើយបន្ថែមសម្រាប់ Frontend

### តើ Frontend និង Backend ធ្វើការជាមួយគ្នាដោយរបៀបណា?

Frontend និង Backend ធ្វើការជាមួយគ្នាតាម GraphQL API។ Frontend ជាផ្នែកដែល user មើលឃើញ និងប្រើប្រាស់ ដូចជា Login, POS, Dashboard, Product និង Warehouse pages។ Backend ជាផ្នែកដែលគ្រប់គ្រង database, validation, authentication និង business logic។ ពេល user ចុចប៊ូតុង ឬបញ្ចូល form នៅ frontend, frontend ផ្ញើ GraphQL query ឬ mutation ទៅ backend។ Backend ដំណើរការ request នោះ ហើយត្រឡប់ result មក frontend ដើម្បីបង្ហាញទៅ user។

### តើអាចពន្យល់ teamwork រវាង Frontend និង Backend ជាឧទាហរណ៍បានទេ?

ឧទាហរណ៍ នៅពេល cashier លក់ទំនិញនៅ POS:

1. Frontend បង្ហាញ product list និង cart។
2. Cashier ជ្រើស product ហើយចុច checkout។
3. Frontend ផ្ញើ `createSale` mutation ទៅ backend។
4. Backend ពិនិត្យ sale data, គណនាតម្លៃ, បង្កើត sale, កាត់ stock និងបង្កើត stock movement log។
5. Backend ត្រឡប់ success ឬ error មក frontend។
6. Frontend បង្ហាញ message, clear cart ឬបង្ហាញ error ប្រសិនបើ stock មិនគ្រប់។

នេះបង្ហាញថា frontend មិនធ្វើ database logic ដោយខ្លួនឯងទេ។ Frontend ទទួលខុសត្រូវលើ user experience ហើយ backend ទទួលខុសត្រូវលើ data និង business rules។

### តើ Frontend ទទួលខុសត្រូវអ្វីខ្លះ?

Frontend ទទួលខុសត្រូវលើការបង្ហាញ UI, form input, navigation, user interaction, loading state, alert message, table, chart, dialog និងការផ្ញើ request ទៅ backend។ Frontend ធ្វើឱ្យ user អាចប្រើប្រព័ន្ធបានងាយ និងមើល data បានច្បាស់។

### តើ Backend ទទួលខុសត្រូវអ្វីខ្លះ?

Backend ទទួលខុសត្រូវលើ authentication, authorization, validation, business logic, stock calculation, report calculation, database read/write, backup/restore និង API response។ Backend ជាអ្នកការពារ data integrity។

### ហេតុអ្វីបានជា Frontend មិនភ្ជាប់ទៅ MongoDB ដោយផ្ទាល់?

ព្រោះវាមិនមានសុវត្ថិភាព។ ប្រសិនបើ frontend ភ្ជាប់ទៅ database ដោយផ្ទាល់ user អាចឃើញ database credential ឬអាច bypass business logic បាន។ ដូច្នេះ frontend ត្រូវតែភ្ជាប់តាម backend API។ Backend ជាអ្នកគ្រប់គ្រង permission, validation និង database operation។

### តើ Data Flow ពី Frontend ទៅ Backend ដំណើរការយ៉ាងដូចម្តេច?

Data flow គឺ៖

1. User ធ្វើ action នៅ frontend។
2. React component ប្រមូល input data។
3. Apollo Client ផ្ញើ GraphQL query/mutation។
4. Backend resolver ទទួល request។
5. Backend ធ្វើ validation និង update/query MongoDB។
6. Backend ត្រឡប់ response។
7. Frontend update UI តាម response នោះ។

### តើ GraphQL ជួយ Frontend យ៉ាងដូចម្តេច?

GraphQL អនុញ្ញាតឱ្យ frontend ស្នើសុំ data តែប៉ុណ្ណោះដែលត្រូវការ។ ឧទាហរណ៍ Dashboard អាចស្នើសុំ summary, chart data និង recent transaction ក្នុង query មួយ។ វាជួយកាត់បន្ថយ request ច្រើន និងធ្វើឱ្យ frontend code រៀបចំបានច្បាស់។

### តើ Frontend ដោះស្រាយ error ពី Backend យ៉ាងដូចម្តេច?

Frontend ទទួល error response ពី backend ហើយបង្ហាញ alert message ឱ្យ user ដឹង។ ឧទាហរណ៍ បើ stock មិនគ្រប់, backend ត្រឡប់ error message ហើយ frontend បង្ហាញ message នោះ។ បើ error ជា `UNAUTHENTICATED`, Apollo Client នឹង clear token និង logout user ដោយស្វ័យប្រវត្តិ។

### តើ Frontend និង Backend ធ្វើការជាមួយ Authentication យ៉ាងដូចម្តេច?

ពេល login, frontend ផ្ញើ email/password ទៅ backend។ Backend ពិនិត្យ user ហើយត្រឡប់ JWT token។ Frontend រក្សា token នៅ localStorage។ រាល់ request បន្ទាប់ Apollo Client ដាក់ token នៅក្នុង Authorization header។ Backend យក token នោះទៅ verify ហើយដឹងថា request នោះមកពី user ណា។

### តើ Frontend មាន Role ក្នុងការការពារ Security ដែរឬទេ?

មាន ប៉ុន្តែ frontend គ្រាន់តែជួយបង្ហាញ ឬលាក់ menu/page តាម user role ប៉ុណ្ណោះ។ Security ពិតប្រាកដត្រូវធ្វើនៅ backend ព្រោះ backend ជាអ្នកពិនិត្យ permission មុនអនុញ្ញាតឱ្យ create, update, delete ឬ query data សំខាន់ៗ។

### តើ Frontend ធ្វើឱ្យប្រព័ន្ធងាយប្រើដោយរបៀបណា?

Frontend ផ្តល់ UI ដែលមាន menu ច្បាស់, form, dialog, pagination, loading state, alert message, dashboard chart និង POS cart។ វាជួយឱ្យ cashier, manager, admin និង stock controller អាចធ្វើការរបស់ពួកគេបានលឿន និងមានកំហុសតិច។

### តើ Frontend គាំទ្រភាសាខ្មែរ និងអង់គ្លេសដោយរបៀបណា?

Project មាន translation files នៅក្នុង `src/Lang/khtranslate.json` និង `src/Lang/entranslate.json`។ `AuthContext` រក្សា language setting នៅ localStorage។ ពេល user ប្តូរភាសា UI អាចបង្ហាញពាក្យតាមភាសាដែលបានជ្រើស។

### តើ Frontend គ្រប់គ្រង State យ៉ាងដូចម្តេច?

Frontend ប្រើ React state, Context API និង Apollo Client cache។ `AuthContext` គ្រប់គ្រង user, token, language និង alert។ Apollo Client គ្រប់គ្រង API request និង cache សម្រាប់ GraphQL data។ Components ផ្សេងៗប្រើ local state សម្រាប់ form, dialog, cart និង loading។

### តើ Frontend មានអ្វីពាក់ព័ន្ធនឹង Report?

Frontend មិន calculate report ធំៗដោយខ្លួនឯងទេ។ Frontend call GraphQL report queries ទៅ backend ហើយ backend គណនា data។ បន្ទាប់មក frontend បង្ហាញជា table, card និង chart ដើម្បីឱ្យ manager អាចយល់ business performance បានងាយ។

### តើ Frontend មានអ្វីពាក់ព័ន្ធនឹង Image Upload?

Frontend មាន image upload utility និង Supabase client។ ពេល user upload រូបភាព product ឬ profile, frontend upload file ទៅ storage ហើយរក្សា URL ដើម្បីផ្ញើទៅ backend ឬបង្ហាញក្នុង UI។

### តើ Frontend មានការបែងចែក Code ដើម្បីធ្វើការជាក្រុមយ៉ាងដូចម្តេច?

Code ត្រូវបានបំបែកជា pages, components, context, menu, styles និង GraphQL files។ អ្នកធ្វើ frontend អាចធ្វើ POS page ខណៈម្នាក់ទៀតធ្វើ Warehouse components ហើយម្នាក់ទៀតធ្វើ Report page។ ព្រោះ GraphQL queries/mutations ត្រូវបានបំបែកនៅ folder `graphql`, frontend team អាចប្រើ API contract ជាមួយ backend team បានច្បាស់។

### តើ Frontend Team និង Backend Team ត្រូវ agree លើអ្វីខ្លះ?

Frontend និង Backend ត្រូវ agree លើ API contract ដូចជា query name, mutation name, input fields, output fields, error message និង authentication rule។ ឧទាហរណ៍ បើ frontend call `createSale`, backend ត្រូវកំណត់ថា input ត្រូវមាន fields អ្វី ហើយ response ត្រឡប់អ្វី។ វាជួយឱ្យការងារជាក្រុមមិនច្របូកច្របល់។

### បើ Backend ផ្លាស់ប្តូរ API តើ Frontend ប៉ះពាល់ដូចម្តេច?

បើ backend ផ្លាស់ប្តូរ field name, mutation name ឬ response shape, frontend អាច error ព្រោះ query/mutation មិនត្រូវគ្នា។ ដូច្នេះ frontend និង backend ត្រូវ communicate មុនពេល change API ហើយ update GraphQL files និង components ដែលពាក់ព័ន្ធ។

### តើ Frontend Test ឬ Verify Feature ដោយរបៀបណា?

អាច verify ដោយ run frontend, login, សាកល្បង workflow សំខាន់ៗដូចជា create product, create sale, receive purchase order, transfer stock និងមើល report។ ក៏អាចពិនិត្យ browser console, network request និង GraphQL response ដើម្បីរក error។

### តើអ្វីជាចំណុចខ្លាំងបំផុតរបស់ Frontend?

ចំណុចខ្លាំងគឺវាគាំទ្រ workflow ពេញលេញសម្រាប់ Smart Market។ User អាច login, លក់ទំនិញ, គ្រប់គ្រង stock, មើល reports, គ្រប់គ្រង users/products/shops និងប្រើ interface ជាភាសាខ្មែរ ឬអង់គ្លេស។ វាភ្ជាប់ជាមួយ backend តាម GraphQL បានច្បាស់ និងមាន structure ដែលអាចពង្រីកបន្តបាន។

### បើគ្រូសួរថា Project នេះ Full Stack យ៉ាងដូចម្តេច តើឆ្លើយអ្វី?

ខ្ញុំអាចឆ្លើយថា Project នេះជា Full Stack ព្រោះមាន frontend និង backend ធ្វើការជាមួយគ្នា។ Frontend ប្រើ React សម្រាប់ UI និង Apollo Client សម្រាប់ call GraphQL API។ Backend ប្រើ Node.js, GraphQL, Mongoose និង MongoDB សម្រាប់ business logic និង database។ Frontend ផ្ញើ request ទៅ backend ហើយ backend ត្រឡប់ data មកវិញ ដូច្នេះ user អាចប្រើប្រព័ន្ធបានពេញលេញ។
