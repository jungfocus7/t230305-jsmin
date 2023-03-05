const os = require('node:os');
// const path = require('node:path');
const fs = require('node:fs');
const readline = require('node:readline');


class JsMinifier {
    /**
     * 생성자
     * @param {string} ip
     * @param {string} op
     */
    constructor(ip, op) {
        const gd = this.#gd;
        gd.ifp = ip;
        gd.ofp = op;
        // console.log(`ifp: ${gd.ifp}, ofp: ${gd.ofp}`);
    }

    /** 글로벌 데이터 오브젝트 */
    #gd = Object.seal({
        eol: os.EOL,
        ifp: '', ofp: '',
        frs: null, fws: null,
        rl: null,
        bcm: false,
        bf: true
    });



    /**
     * 한줄주석 제거
     * @param {string} tx
     * @returns
     */
    fn_clearCommentsOneLine = (ls) => {
        if ((typeof ls !== 'string') || (ls === '')) return '';
        const rex = /^[ \t]*\/\/[^\r\n]*$/;
        if (rex.test(ls) === true)
            return '';
        else
            return ls;
    };


    /**
     * 다중주석 제거
     * @param {string} ls
     * @returns
     */
    fn_clearCommentsMultiLineAll = (ls) => {
        if ((typeof ls !== 'string') || (ls === '')) return '';
        const rex = /\/\*[\S\s]*?\*\//g;
        const rv = ls.replaceAll(rex, '').trim();
        return rv;
    };


    /**
     * 다중주석 시작점 제거
     * @param {string} ls
     * @returns
     */
    fn_clearCommentsMultiLineBegin = (ls) => {
        if ((typeof ls !== 'string') || (ls === '')) return '';
        const gd = this.#gd;
        const rex = /\/\*.*?$/;
        const tm = ls.match(rex);
        if (Array.isArray(tm) && (tm.length > 0)) {
            const rv = ls.replace(tm[0], '').trim();
            gd.bcm = true;
            return rv;
        }
        else
            return ls;
    };


    /**
     * 다중주석 끝점 제거
     * @param {string} ls
     * @returns
     */
    fn_clearCommentsMultiLineEnd = (ls) => {
        if ((typeof ls !== 'string') || (ls === '')) return '';
        const gd = this.#gd;
        const rex = /^.*?\*\//;
        const tm = ls.match(rex);
        if (tm !== null) {
            const rv = ls.replace(tm[0], '').trim();
            gd.bcm = false;
            return rv;
        }
        else
            return '';
    };



    /**
     * 핵심 작업
     */
    fn_work = async () => {
        const gd = this.#gd;
        try {
            fs.accessSync(gd.ifp);
            gd.frs = fs.createReadStream(gd.ifp);
            gd.fws = fs.createWriteStream(gd.ofp);
            gd.rl = readline.createInterface({
                input: gd.frs,
                crlfDelay: Infinity
            });

            for await (let ls of gd.rl) {
                ls = ls.trim();
                if (ls === '') continue;
                ls = this.fn_clearCommentsOneLine(ls);
                ls = this.fn_clearCommentsMultiLineAll(ls);
                if (gd.bcm === false)
                    ls = this.fn_clearCommentsMultiLineBegin(ls);
                else
                    ls = this.fn_clearCommentsMultiLineEnd(ls);
                if (ls !== '') {
                    // console.log(ls);
                    if (gd.bf === true) {
                        gd.fws.write(ls);
                        gd.bf = false;
                    }
                    else
                        gd.fws.write('\n' + ls);
                }
            }
        }
        catch (e) {
            console.log(`# Error  ${e}`);
        }
        finally {
            gd.frs.close();
            gd.fws.close();
            gd.rl.close();
        }

        return `Output: ${gd.ofp}`;
    };


    // fn_clear = () => {
    //     const gd = this.#gd;
    //     try {
    //         gd.frs.close();
    //         gd.fws.close();
    //         gd.rl.close();
    //     }
    //     catch { }
    // }

}

module.exports = { JsMinifier };











// const os = require('node:os');
// const path = require('node:path');
// const fs = require('node:fs');
// const readline = require('node:readline');





// /**
//  * 한줄주석 제거
//  * @param {string} tx
//  * @returns
//  */
// const fn_clearCommentsOneLine = (ls) => {
//     if ((typeof ls !== 'string') || (ls === '')) return '';
//     const rex = /^[ \t]*\/\/[^\r\n]*$/;
//     if (rex.test(ls) === true)
//         return '';
//     else
//         return ls;
// };

// /**
//  * 다중주석 제거
//  * @param {string} ls
//  * @returns
//  */
// const fn_clearCommentsMultiLineAll = (ls) => {
//     if ((typeof ls !== 'string') || (ls === '')) return '';
//     const rex = /\/\*[\S\s]*?\*\//g;
//     const rv = ls.replaceAll(rex, '').trim();
//     return rv;
// };

// /**
//  * 다중주석 시작점 제거
//  * @param {string} ls
//  * @returns
//  */
// const fn_clearCommentsMultiLineBegin = (ls) => {
//     if ((typeof ls !== 'string') || (ls === '')) return '';
//     const rex = /\/\*.*?$/;
//     const tm = ls.match(rex);
//     if (Array.isArray(tm) && (tm.length > 0)) {
//         const rv = ls.replace(tm[0], '').trim();
//         gd.bcm = true;
//         return rv;
//     }
//     else
//         return ls;
// };

// /**
//  * 다중주석 끝점 제거
//  * @param {string} ls
//  * @returns
//  */
// const fn_clearCommentsMultiLineEnd = (ls) => {
//     if ((typeof ls !== 'string') || (ls === '')) return '';
//     const rex = /^.*?\*\//;
//     const tm = ls.match(rex);
//     if (tm !== null) {
//         const rv = ls.replace(tm[0], '').trim();
//         gd.bcm = false;
//         return rv;
//     }
//     else
//         return '';
// };


// /** 글로벌 데이터 오브젝트 */
// const gd = Object.seal({
//     eol: os.EOL,
//     ifp: '', ofp: '',
//     frs: null, fws: null,
//     rl: null,
//     bcm: false,
//     bf: true
// });


// /**
//  * 핵심 작업
//  * @param {string} ip
//  * @param {string} op
//  */
// const fn_work = async (ip, op) => {
//     try {
//         gd.ifp = ip;
//         gd.ofp = op;
//         fs.accessSync(gd.ifp);

//         gd.frs = fs.createReadStream(gd.ifp);
//         gd.fws = fs.createWriteStream(gd.ofp);
//         gd.rl = readline.createInterface({
//             input: gd.frs,
//             crlfDelay: Infinity
//         });

//         for await (let ls of gd.rl) {
//             ls = ls.trim();
//             if (ls === '') continue;
//             ls = fn_clearCommentsOneLine(ls);
//             ls = fn_clearCommentsMultiLineAll(ls);
//             if (gd.bcm === false)
//                 ls = fn_clearCommentsMultiLineBegin(ls);
//             else
//                 ls = fn_clearCommentsMultiLineEnd(ls);
//             if (ls !== '') {
//                 // console.log(ls);
//                 if (gd.bf === true) {
//                     gd.fws.write(ls);
//                     gd.bf = false;
//                 }
//                 else
//                     gd.fws.write('\n' + ls);
//             }
//         }
//     }
//     catch (e) {
//         console.log(`# Error  ${e}`);
//     }
//     finally {
//         gd.frs.close();
//         gd.fws.close();
//         gd.rl.close();
//     }
// };



// (async () => {
//     console.time('Work time');
//     const fnma = [
//         'test__jQuery', 'test__lodash', 'test__vue', 'test__d3', 'test__typescript',
//         'test__react'];
//     for (const fnm of fnma) {
//         await fn_work(
//             path.resolve(__dirname, `test\\${fnm}.js`),
//             path.resolve(__dirname, `test\\${fnm}_d.js`));
//     }
//     console.timeEnd('Work time');
//     console.log(`# All done`);
// })();

