    const form = document.getElementById("form");
    const maxScoreInput = document.getElementById("maxScore");
    const branchesInput = document.getElementById("branches");
    const directoryInput = document.getElementById("directory");
    const namespaceInput = document.getElementById("namespace");
    const playerInput = document.getElementById("player");
    const scoreboardInput = document.getElementById("scoreboard");
    const customContentInput = document.getElementById('customContent');

    form.addEventListener("submit", function (e) {
    e.preventDefault();

    const maxScore = parseInt(maxScoreInput.value);
    const branches = parseInt(branchesInput.value);
    const directory = directoryInput.value;
    const namespace = namespaceInput.value;
    const player = playerInput.value;
    const scoreboard = scoreboardInput.value;
    const customContent = customContentInput.value;

    const zip = new JSZip();

    function operaFunction(score, obj, player, customContent) {
        return customContent.replace('${player}', player)
                            .replace('${scoreboard}', obj)
                            .replace('${score}', score);
    }

    function carry_bit(i) {
        if (i % 1 !== 0) {
            return Math.floor(i + 1);
        }
        return Math.floor(i);
    }
    
    function start(max, branch, folder, opera, namespace = "", obj = "int", player = "#index", customContent = "say 你没设定命令内容!!!") {
        if (branch < 2) {
            branch = 2;
        }
    
        const zzzFolder = zip.folder(`${folder}/zzz`);
        const zzzDoFolder = zzzFolder.folder("do");
    
        if (namespace !== "") {
            var funchead = `${namespace}:${folder}/zzz/`;
        } else {
            var funchead = `${folder}/zzz/`;
        }
    
        var row = carry_bit(Math.log(max) / Math.log(branch));
        for (var now_row = 0; now_row < row; now_row++) {
            var score = 1;
            if (now_row === (row - 1)) {
                for (var now_point = 0; now_point < Math.pow(branch, now_row); now_point++) {
                    var content = "";
                    for (var now_br = 0; now_br < branch; now_br++) {
                        content += `execute if score ${player} ${obj} matches ${score} run function ${funchead}do/${score}\n`;
                        score++;
                    }
                    zzzFolder.file(`tree${now_row}_${now_point}.mcfunction`, content);
                }
            } else {
                var left = 1;
                for (var now_point = 0; now_point < Math.pow(branch, now_row); now_point++) {
                    var content = "";
                    for (var now_br = 0; now_br < branch; now_br++) {
                        var right = Math.pow(branch, (row - now_row - 1)) * (now_br + now_point * branch + 1);
                        content += `execute if score ${player} ${obj} matches ${left}..${right} run function ${funchead}tree${now_row + 1}_${now_br + now_point * branch}\n`;
                        left = right + 1;
                    }
                    zzzFolder.file(`tree${now_row}_${now_point}.mcfunction`, content);
                }
            }
        }

        zip.file(`${folder}/root.mcfunction`, `execute if score ${player} ${obj} matches 1..${max} run function ${funchead}tree0_0`);
    
        for (var score = 1; score <= max; score++) {
            var content = opera(score, obj, player, customContent);
            zzzDoFolder.file(`${score}.mcfunction`, content);
        }    
        zip.generateAsync({ type: 'blob' })
            .then(function (content) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'scbtree.zip';
                link.click();
            });
    }
    
    start(maxScore, branches, directory,operaFunction, namespace, scoreboard, player, customContent);
    });
