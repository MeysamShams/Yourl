export default () => ({
    port: parseInt(process.env.PORT, 10) || 3001,
    host:'0.0.0.0',
    database:{
        url:process.env.STAGE==='prod' ? process.env.DATABASEURL : "mongodb://127.0.0.1:27017",
        name:'Yourl'
    },
    cookie:{
        secret:"R@fg5J7&viE%1!*h",
        setCookieOption:{
            expires:new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // 7 days
            secure:true,
            httpOnly:true,
            path:"/"
       }
    },
    jwt:{
        secret:"Vg7$2!klTM&yoP@",
        expiresIn:'7d'
    }
  });