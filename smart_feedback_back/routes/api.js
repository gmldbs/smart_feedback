var express = require('express');
var router = express.Router();
var {PythonShell} = require('python-shell');
var fs = require('fs');
var _problem_name = '';
const { type } = require('os');
const { formatWithOptions } = require('util');

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

router.get('/get_question_list', function(req, res, next) {
  res.send(getDirectories('./smart_feedback_refactory/data'))
});

router.post('/submit_code', function(req, res, next) {
  const code = req.body.code
  const question = req.body.problem
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
sys.stdout=open('output_${testcase_num}.out', 'w', encoding='utf8')
` + code
        fs.readFile(`${__dirname}/../smart_feedback_refactory/data/${question}/ans/${file}`,(err, data) => {
          if(err) throw err
          var test_content = content + `
print(${data})`
          fs.writeFile(`${__dirname}/../smart_feedback_refactory/student_codes/exec_${testcase_num}.py`, test_content, function(err) {
            if(err) throw err
            var options = {
              mode: 'text',
              pythonPath: '', 
              pythonOptions: ['-u'],
              scriptPath: __dirname+'/../smart_feedback_refactory/student_codes/',
              args: [ 'value1', 'value2', 'value3'],
            };
            input_files = 
            PythonShell.run(`./exec_${testcase_num}.py`, options, function (err, results) {
              if (err) {
                console.log(err)
                res.send(err.message);
              } else {
                fs.readFile(`./output_${testcase_num}.out`, 'utf8', function(err, output_data) {
                  if(err) console.log(err)
                  fs.readFile(`${__dirname}/../smart_feedback_refactory/data/${question}/ans/output_${testcase_num}.txt`, 'utf8',(err, correct_data) => {
                    if(err) console.log(err)
                    if(output_data == correct_data) correct++
                    check_cnt++
                    if(check_cnt == total) {
                      res.send({total: total, correct: correct})
                      if(correct !== total) {
                        fs.writeFile(`${__dirname}/../smart_feedback_refactory/data/${question}/code/wrong/wrong_001.py`, code, function(err) {
                          if(err) throw err
                          console.log("write wrong file")
                        })
                      }
                      else {
                        fs.writeFile(`${__dirname}/../smart_feedback_refactory/data/${question}/code/correct/correct_2016.py`, code, function(err) {
                          if(err) throw err
                          console.log("write correct file")
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
