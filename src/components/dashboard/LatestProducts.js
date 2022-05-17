// import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { productApi } from 'src/utils/api';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';

// const products = [
// {
// id: uuid(),
// name: 'Dropbox',
// imageUrl: '/static/images/products/product_1.png',
// updatedAt: moment().subtract(2, 'hours')
// },
// {
// id: uuid(),
// name: 'Medium Corporation',
// imageUrl: '/static/images/products/product_2.png',
// updatedAt: moment().subtract(2, 'hours')
// },
// {
// id: uuid(),
// name: 'Slack',
// imageUrl: '/static/images/products/product_3.png',
// updatedAt: moment().subtract(3, 'hours')
// },
// {
// id: uuid(),
// name: 'Lyft',
// imageUrl: '/static/images/products/product_4.png',
// updatedAt: moment().subtract(5, 'hours')
// },
// {
// id: uuid(),
// name: 'GitHub',
// imageUrl: '/static/images/products/product_5.png',
// updatedAt: moment().subtract(9, 'hours')
// }
// ];

const LatestProducts = (props) => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await productApi.getAll({ limit: 7 });
      setProducts(response.data.data.records);
    };
    fetchProducts();
  }, []);
  return (
    <Card {...props}>
      <CardHeader
        subtitle={`${products.length} in total`}
        title="Latest Products"
      />
      <Divider />
      <List>
        {products.map((product, i) => (
          <ListItem
            divider={i < products.length - 1}
            key={product._id}
          >
            <ListItemAvatar>
              <img
                alt={product.name}
                src={product.thumbnail}
                style={{
                  height: 48,
                  width: 48
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={(
                <Link
                  component={RouterLink}
                  to={`/management/product/${product._id}/edit`}
                  underline="none"
                >
                  {product.name}
                </Link>
          )}
              secondary={`Updated ${moment(product.updatedAt).fromNow()}`}
            />
            <IconButton
              edge="end"
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
          component={RouterLink}
          to="/management/product"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
};

export default LatestProducts;
