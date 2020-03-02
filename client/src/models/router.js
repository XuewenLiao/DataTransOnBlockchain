import Home from '../views/Home';
import Mine from '../views/Mine';
import UploadManage from '../views/UploadManage';
let routes = [
    {
      path: "/",
      component: Home,
      exact: true
    },
    {
      path: "/mine",
      component: Mine
    },
    {
      path: "/uploadmanage",
      component: UploadManage
    }
  ];

  export default routes;