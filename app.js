'use strict';
const fs = require('node:fs');
const readline = require('node:readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs});
const prefectureDataMap = new Map();//key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2016 || year === 2021) {
    let value = null;
    if (prefectureDataMap.has(prefecture)) {
      value = prefectureDataMap.get(prefecture);
    } else {
      value = {
        before: 0,
        after: 0,
        change: null
      };
    }
    if (year === 2016) {
      value.before = popu;
    }
    if (year === 2021) {
      value.after = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
  for (const [key, value] of prefectureDataMap) {
    value.change = value.after / value.before;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  console.log(rankingArray);
});


/**要件「2016年から2021年にかけて、15～19歳の人が増えた割合の都道府県ランキング」を作成
 * 
 * 1 ファイルからデータを読み取る
 * 2 2016年と2021年のデータを選ぶ
 * 3 都道府県ごとの変化率を計算する
 * 4 変化率ごとに並べる
 * 5 並べられたものを表示する
 * 
 */