var express = require('express');
var router = express.Router();
var {PythonShell} = require('python-shell');
var fs = require('fs');
var csv = require("csv-parser");
var _problem_name = '';
const firebase = require('./firebase_config');
const { type } = require('os');
const { formatWithOptions } = require('util');
const spawn = require('child_process').spawn

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}
function checkSmartFeedback(path) {
  return fs.readdirSync(path).filter(function (file) {
    return file.substring(file.lastIndexOf('.')+1,file.length).toLowerCase() == "csv"
  })
}
function Feedback(problem_name, problem_key) {
  var options = {
    mode: 'text',
    pythonPath: '', 
    pythonOptions: ['-u'],
    scriptPath:  __dirname+'/../smart_feedback_refactory/',
    args: [ '-d', __dirname+'/../smart_feedback_refactory/data', '-q', `${problem_name}`, '-s', '100', '-o', '-m', '-b'],
  };
  PythonShell.run('./run.py', options, function (err, results) {
    if (err) {
      console.log(err)
    } else {
      firebase.firestore().collection('Problems').doc(problem_key).set({state: 2}, {merge : true})
      var results = []
      fs.createReadStream(`../smart_feedback_refactory/data/${problem_name}/${csv_name}`)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        res.send(results)
      });
    }
  });
}

router.get('/firebase_test', function(req, res){
  firebase.firestore().collection('User').doc("test")
  .set({
  password: "1234",
  isAdmin: false
  }).then(function() {
    return res.json({firebase: true})
  })
});

router.get('/get_question_list', function(req, res, next) {
  res.send(getDirectories('./smart_feedback_refactory/data'))
});

router.post('/get_question_info', function(req, res, next) {
  const problem_name = req.body.problem_name
  res.send(checkSmartFeedback(`./smart_feedback_refactory/data/${problem_name}`))
});

router.post('/get_feedback_info', function(req, res, next) {
  const csv_name = req.body.csv_name
  const problem_name = req.body.problem_name
  var results = []
  fs.createReadStream(`./smart_feedback_refactory/data/${problem_name}/${csv_name}`)
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    res.send(results)
    console.log(results)
  });
});

router.post('/do_feedback', function(req, res, next) {
  Feedback(req.body.problem_name, req.body.problem_key)
  firebase.firestore().collection('Problems').doc(req.body.problem_key)
  .set({
  state : 1
  }, {merge : true}).then(function() {
    res.send(true)
  })
});

router.post('/submit_code', function(req, res, next) {
  const code = req.body.code
  const question = req.body.problem
  const student_id = req.body.student_id
  var correct = 0
  var check_cnt = 0
  var total = 0
  fs.readdir(`${__dirname}/../smart_feedback_refactory/data/${question}/ans`, function (err, files) {
    if(err) throw err
    files.forEach(function (file) {
      if(file.includes('input')) {
        total++
        var testcase_num = file.split(".")[0].slice(-3)
        var content = `import time, sys, base64
sys.stdout=open('${student_id}_${testcase_num}_output.txt', 'w', encoding='utf8')
` + code
        fs.readFile(`${__dirname}/../smart_feedback_refactory/data/${question}/ans/${file}`,(err, data) => {
          if(err) throw err
          var test_content = content + `
print(${data})`
          fs.writeFile(`${__dirname}/../smart_feedback_refactory/student_codes/${student_id}_${testcase_num}.py`, test_content, function(err) {
            if(err) throw err
            var options = {
              mode: 'text',
              pythonPath: '', 
              pythonOptions: ['-u'],
              scriptPath: __dirname+'/../smart_feedback_refactory/student_codes/',
            };
            input_files = 
            PythonShell.run(`./exec_${testcase_num}.py`, options, function (err, results) {
              if (err) {
                console.log(err)
                res.send(err.message);
              } else {
                fs.readFile(`./${student_id}_${testcase_num}_output.txt`, 'utf8', function(err, output_data) {
                  if(err) console.log(err)
                  fs.readFile(`${__dirname}/../smart_feedback_refactory/data/${question}/ans/${student_id}_${testcase_num}_output.txt`, 'utf8',(err, correct_data) => {
                    if(err) console.log(err)
                    if(output_data == correct_data) correct++
                    check_cnt++
                    if(check_cnt == total) {
                      res.send({total: total, correct: correct})
                      if(correct !== total) {
                        fs.writeFile(`${__dirname}/../smart_feedback_refactory/data/${question}/code/wrong/wrong_${student_id}.py`, code, function(err) {
                          if(err) throw err
                        })
                      }
                      else {
                        fs.writeFile(`${__dirname}/../smart_feedback_refactory/data/${question}/code/correct/correct_${student_id}.py`, code, function(err) {
                          if(err) throw err
                        })
                      }
                    }
                  })
                });
              }
            });
          })
        })
      }
    });
  })
});

router.post('/run_code', function(req, res, next) {
  const code = req.body.code
  const student_id = req.body.student_id
  var content = `import time, sys, base64
sys.stdout=open('smart_feedback_refactory/student_codes/${student_id}_output.out', 'w', encoding='utf8')
` + code
  var correct = 0
  var check_cnt = 0
  var total = 0
  fs.writeFile(`${__dirname}/../smart_feedback_refactory/student_codes/${student_id}.py`, content, function(err) {
    if(err) throw err
    var options = {
      mode: 'text',
      pythonPath: '', 
      pythonOptions: ['-u'],
      scriptPath: __dirname+'/../smart_feedback_refactory/student_codes/',
    };
    PythonShell.run(`./${student_id}.py`, options, function (err, results) {
      if (err) {
        console.log(err)
        res.send(err.message);
      } else {
        fs.readFile(`smart_feedback_refactory/student_codes/${student_id}_output.out`, 'utf8', function(err, output_data) {
          if(err) res.send(err)
          else res.send(output_data)
        })
      }
    })
  })
})

router.post('/upload_problem_name', function(req, res, next) {
  var isErr = false
  var cnt = 0
  _problem_name = req.body.problem_name
  const path = `${__dirname}/../smart_feedback_refactory/data/${_problem_name}`
  fs.mkdir(path, (err) => {
    if (err) return res.send("Error")
    else {
      fs.mkdir(path+'/ans', (err) => {
        cnt++
        if(err) isErr = true
        if(cnt==5) {
          if(!isErr) return res.send("Success")
          else return res.send("Error")
        }
      })
      fs.mkdir(path+'/code', (err) => {
        cnt++
        if(err) isErr = true
        else {
          fs.mkdir(path+'/code/reference', (err) => {
            if(err) isErr = true
            cnt++
            if(cnt==5) {
              if(!isErr) return res.send("Success")
              else return res.send("Error")
            }
          })
          fs.mkdir(path+'/code/correct', (err) => {
            if(err) isErr = true
            cnt++
            if(cnt==5) {
              if(!isErr) return res.send("Success")
              else return res.send("Error")
            }
          })
          fs.mkdir(path+'/code/wrong', (err) => {
            if(err) isErr = true
            cnt++
            if(cnt==5) {
              if(!isErr) return res.send("Success")
              else return res.send("Error")
            }
          })
        }
      })
    }
  });
});

router.post('/upload_reference', function(req, res, next) {
  var isErr = false
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" })
  }
  for(var i=0;i<req.files.file.length;i++)
  {
    const myFile = req.files.file[i]
    myFile.mv(`${__dirname}/../smart_feedback_refactory/data/${_problem_name}/code/reference/${myFile.name}`, function (err) {
      if (err) {
          isErr= true
          return res.send({ msg: "Error occured" });
      }
    });
  }
  if(!isErr) return res.send("success");
});
router.post('/upload_testcase', function(req, res, next) {
  var isErr = false
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" })
  }
  for(var i=0;i<req.files.file.length;i++)
  {
    const myFile = req.files.file[i]
    myFile.mv(`${__dirname}/../smart_feedback_refactory/data/${_problem_name}/ans/${myFile.name}`, function (err) {
      if (err) {
          isErr= true
          return res.send({ msg: "Error occured" });
      }
    });
  }
  if(!isErr) return res.send("success");
});

router.post('/exist_check', function(req, res, next) {
  const problem_name = req.body.problem_name;
  var path = `${__dirname}/../smart_feedback_refactory/data/${problem_name}`
  if (fs.existsSync(path)) {
    return res.send(true)
  } else {
      return res.send(false)
  }
});

module.exports = router;
