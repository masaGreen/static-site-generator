const fs = require("fs")
const path = require("path")
const matter = require("frontmatter")
const marked = require("marked")
const express = require('express')


const app = express()

app.use(express.static("dist"))
app.use(express.static(path.join(path.resolve(),"public")))



//add all .md files into an array
const mdFolderPath  = path.join(path.resolve(), "markdown")
const filepath = path.join(path.resolve(), "pages/index.html")

const allMarkDownsArray = fs.readdirSync(mdFolderPath)
//process each md file into an object that can be inserted into the html
function main(markfiles){
  markfiles.forEach((file)=>{
    //read the md into a string
    const readMd = fs.readFileSync(path.join(mdFolderPath,file) , "utf8", (err)=>{
        if(err){console.log(err)}
    })
    //getting the md  as an object
    const header = matter(readMd)
    //md content as html
    const contentHtml = marked.parse(header.content)

    //rading the html tempalate and insert the data from mdfiles
    
    
    const htmlData = fs.readFileSync(filepath, "utf8", (err)=>{
            if(err){console.log(err)}
        })
    const mdObject = {...header, content:contentHtml}
    //insertion
    const editedhtmlData = htmlData
            .replace(/<!-- title -->/, mdObject.data.title)
            .replace(/<!-- Author -->/, mdObject.data.author)
            .replace(/<!-- content -->/,mdObject.content)
        
    
    
    
    //write to dist folder//save
    let destinationPath = path.join(path.resolve(), "dist", `${path.basename(path.join(mdFolderPath,file), ".md")}.html` )
    if(fs.existsSync("./dist")){
      fs.writeFileSync(destinationPath, editedhtmlData, (err)=>{
        if(err){console.log(err)} 
    })
    }else{
      fs.mkdirSync("./dist")
      fs.mkdirSync("./dist/assets")
      fs.writeFileSync(destinationPath, editedhtmlData, (err)=>{
        if(err){console.log(err)}
        
    })
    } 

  })

  console.log("serving your webpages at http://localhost:3000")
}

main(allMarkDownsArray)


app.get("/page2", (req,res)=>{
  
   res.sendFile(path.join(path.resolve(),"dist/page2.html"))
})


app.listen(3000, ()=>{console.log("server running on port 3000")})