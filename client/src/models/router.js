import Home from '../views/Home';
import News from '../views/News';
import UploadManage from '../views/UploadManage';
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
      path: "/uploadmanage",
      component: UploadManage
    }
  ];

  export default routes;