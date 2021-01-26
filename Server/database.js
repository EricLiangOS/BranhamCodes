const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/main.sqlite'
});

const User = sequelize.define('User', {
    // Model attributes are defined here
    //github username of the user
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //github avatar of the user
    avatar_url: {
      type: DataTypes.STRING
    },
    //problems solved by the user
    problems: {
        type: DataTypes.STRING
    },
    //unique user string
    user_string:{
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User'
  });


sequelize.sync()

class db_manager {
    constructor(){ 
    
    }
    async debug(){
        await User.destroy({truncate: true})
    }
    //returns a user json if a user exists, otherwise returns false
    async get_user(username){
        const user = await User.findAll({
            where:{
              name:username
            },
            raw:true
        })
        if (user.length == 0){
            return false
        }
        else{
            return user[0]
        }
    }
    //adds a user if a certain user does not exist
    async add_user(username, url){
        var user = await this.get_user(username)
        if (user == false){
            var user_str = [...Array(20)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
            await User.create({
                name:username,
                avatar_url:url,
                problems:"",
                user_string:user_str
            })
        }
    }
    //print out a list of all users to console
    async print_users(){
        var str = await User.findAll({raw:true})
        console.log(str)
    }

    //gets a user string based on username (CAREFUL)
    async get_user_string(username){
        const user = await User.findAll({
            where:{
              name:username
            },
            raw:true
        })
        if (user.length == 0){
            return false
        }
        else{
            return user[0].user_string
        }
    }
}

module.exports = new db_manager()