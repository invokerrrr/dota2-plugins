const yml = require("js-yaml");
const glob = require("glob");
const fs = require("fs");
const mkdirp=require("mkdirp");
function _updateObj(newObj,oldObj)
{
    for(let k in oldObj){
        newObj[k]=oldObj[k];
    }
}
function _resolveObj(obj){
    let props=[];
    for(let index in obj){
        let element=obj[index];
        let desc=element.desc;
        //let ref=element.ref;
        props.push({
            name:index,
            description:desc,
            references:[{
                url:"https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/CSS_Properties#"+index,
                name:`See ${index}`
            }],
            syntax:element.syntax,
            status:"nonstandard"
        });
    }
    return {
        version:1.1,
     //   pesudoClasses:[],
        properties:props
    };
}
function buildAll(cb) {
    glob("./src/css/**.yml", (err,files) => {
        if(err) {cb(err);return; }
        let doc={};
        for (let file of files) {
            _updateObj(doc,yml.safeLoad(fs.readFileSync(file, "utf-8")));
        }
        mkdirp.sync("./dist");
        doc=_resolveObj(doc);
        fs.writeFile("./dist/css.css-data.json",JSON.stringify(doc),"utf-8",cb);
    });
}


exports.default = buildAll;