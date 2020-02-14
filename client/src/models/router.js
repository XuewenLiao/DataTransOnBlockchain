import Home from '../views/Home';
import News from '../views/News';
import Product from '../views/Product';
let routes = [
    {
      path: "/",
      component: Home,
      exact: true
    },
    {
      path: "/news",
      component: News
    },
    {
      path: "/product",
      component: Product
    }
  ];

  export default routes;