export default {
  development: {
    baseUrl: '/saascloud/saas',
    pulicPath: '',
    loginPath: 'http://localhost:8080/#/login',
  },
  sit: {
    baseUrl: '/saascloud/saas',
    pulicPath: '/industryCenter',
    loginPath: 'https://sit.rlinkiot.com/console/#/login',
  },
  uat: {
    baseUrl: '/saascloud/saas',
    pulicPath: '/industryCenter',
    loginPath: 'https://uat.rlinkiot.com/console/#/login',
  },
  prod: {
    baseUrl: '/saascloud/saas',
    pulicPath: '/industryCenter',
    loginPath: 'https://prod.rlinkiot.com/console/#/login',
  },
};
