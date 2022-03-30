export default () => ({
    port: parseInt(process.env.PORT, 10) || 3001,
    database:{
        url:"mongodb://127.0.0.1:27017",
        name:process.env.STAGE==="prod"? 'Yourl' :'YourlDev'
    },
    cookie:{
        secret:"R@fg5J7&viE%1!*h",
        expires:new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // 7 days
    },
    jwt:{
        secret:"Vg7$2!klTM&yoP@",
        expiresIn:'7d'
    }
  });