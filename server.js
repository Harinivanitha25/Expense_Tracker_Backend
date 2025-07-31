const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const app=express();
const port=3000
app.use(cors())
app.use(express.json());
require('dotenv').config();
const MONGO_URI=process.env.MONGO_URI;
const connectDb=async()=>
{
    try{
        await mongoose.connect(MONGO_URI)
        console.log('connected to MongoDB')
    }
    catch(err)
    {
       console.error('Error connecting to MongoDB',err)
       process.exit(1)
    }
}

const expenseScheme=new mongoose.Schema({
    title:{
     type:String,
     required:true
    },
    amount:{
        type:Number,
        required:true
    }
})

const Expense=mongoose.model('Expense',expenseScheme)
app.post('/expense',async(req,res)=>
{
   try{ const {title,amount}=req.body;
    const expense=new Expense({title,amount});
    await expense.save();
    res.status(201).json(expense);
}
catch(error)
{
    console.error('Error saving expense:',error);
    res.status(500).json({error:'Internal server error'})
}
})

app.get('/expense',async(req,res)=>
{  try{
    const expense= await Expense.find()
    res.json(expense)
}
catch(error)
{
  console.log('Error fetching expense:',error)
  res.status(500).json({error:'Internal server error'})
}
})

app.delete('/expense/:id',async(req,res)=>
{
    try{
        const deleteExpense=await Expense.findByIdAndDelete(req.params.id)
        if(!deleteExpense)
        {
            return res.status(404).json({error:"Expense not found"})
        }
        res.json({message:"Deleted successfully"})
    }
    catch(error)
    {
        console.log("Error deleting expense:",error)
        res.status(500).json({error:"Failed to delete expense"})
    }
})

app.put('/expense/:id',async(req,res)=>
{ try{
    const updateExpense=await Expense.findByIdAndUpdate(req.params.id,req.body,{new:true})
    if(!updateExpense)
    {
        return res.status(404).json({error:"Expense not found"})
    }
    res.json(updateExpense)
}
catch(error)
{
    console.log("Error updating expense:",error)
    res.status(500).json({error:"Failed to update expense"})
}

})

connectDb().then(()=>{
app.listen(port,()=>
{
    console.log(`Server is running on https://localhost:${port}`)
})
})