const path = require('path'); 
const fs=require('fs')
// const https=require('https')
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv=require('dotenv')
dotenv.config()
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const User=require('./models/user');
const Expense=require('./models/expense');
const Order=require('./models/order');
const Filesdownloaded=require('./models/filesdownloaded');
const Forgotpasswordreq=require('./models/forgotpassword');

const cors=require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');
const filesRoutes = require('./routes/files');

// const privateKey=fs.readFileSync('server.key') 
// const certificate=fs.readFileSync('-server.cert')

const accessLogStream=fs.createWriteStream(
  path.join(__dirname,'access.log'),
  {flags:'a'}
  );

app.use(helmet());
app.use(morgan('combined',{stream: accessLogStream}));
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);
app.use('/files', filesRoutes);

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,`public/${req.url}`))
})

User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Forgotpasswordreq);
Forgotpasswordreq.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Filesdownloaded);
Filesdownloaded.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

sequelize
  // .sync({ force: true })
  .sync()
  .then(result=>{
    // https.createServer({key:privateKey,cert:certificate},app).listen(process.env.PORT ||3000); 
   app.listen(process.env.PORT ||3000);
  })
