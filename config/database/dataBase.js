
class DataBase{
    constructor(pool){
        this.pool = pool;
    }

    async query(query){
        //console.log(query);
        try{
            const client = await this.pool.connect();
            const res = await client.query(query);
            return res
        }catch (err){
            return err
        }
    }

    async end(){
        await this.pool.end();
    }
}

            
module.exports = DataBase


//Ejemplo Query
/*
const query = `select * from public.categoria`

//console.log(query)
var resp = database.query(query)

resp.then(function(res){
  console.log(res.rows)
})*/