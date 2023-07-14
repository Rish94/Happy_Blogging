const express = require('express');
const path = require('path');
const app = express();

const mongo = require('mongoose');

mongo.connect("mongodb+srv://rishabhagarwal8444:Rish844541@cluster0.qdyyhdi.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true,serverSelectionTimeoutMS: 30000}).then(()=>{
    console.log("DataBase Connected");
})

const schema = mongo.Schema({
    FirstName:String,
    LastName:String,
    Title:String,
    Subtitle:String,
    Image:Array,
    Description:String,
    Email:String,
    CreatorName:String,
})


const model = mongo.model('data',schema);


const port = 5000;

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    // res.send("Hello");
    res.render('HomePage')
})




app.get('/create-page', async (req,res)=>{
    res.render('AddPage');
})

app.post('/create-page', async (req,res)=>{

    // console.log(req.body.fname);
    // const name = req.body.fname;
    // console.log(req.body);


    const {fname,lname,email,blogtitle,subtitle,descrp,img1,img2,img3,img4,creatname} = req.body;

    const data = new model();
    data.FirstName = fname;
    data.LastName = lname;
    data.Email = email;
    data.Title = blogtitle;
    data.Subtitle = subtitle;
    data.Image = [img1,img2,img3,img4];
    data.Description = descrp;
    data.CreatorName = creatname;

   const saved =  await data.save();

   if(!saved){
    console.log("data not saved");
   }else{
    console.log("Data saved Successfully");
   }

    res.redirect('/read-page');
})


app.get('/read-page', async(req,res)=>{

    try{
        const fetchdata = await model.find({});
        //console.log(fetchdata);
    
        res.render('ReadPage',{fetchdata});
    }catch(err){
        console.error(err);
    res.status(500).send('An error occurred');
    }
   
})



app.get('/content-page/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const Contentdata = await model.findById(id);
        // console.log(Contentdata);
    
        res.render('ContentPage',{Contentdata});
    }catch(err){
        console.error(err);
    res.status(500).send('An error occurred');
    }

})


app.get('/delete-page',(req,res)=>{
    res.redirect('/read-page');
})



app.get('/delete-blog/:id',async(req,res)=>{

    try{
    const {id} = req.params;
    const dataclean = await model.deleteOne({_id:id});
    }
    catch(err){
        console.log(err);
    }
    res.redirect('/read-page');
})







app.listen(port,()=>{
    console.log("SERVER LISTEN");
})



