import { useRoutes } from 'react-router';
import routes from '../routes';

const Routing = () => {
  const routing = useRoutes(routes);
  return routing;
};

export default Routing;
