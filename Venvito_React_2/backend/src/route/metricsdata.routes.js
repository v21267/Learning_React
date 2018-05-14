'use strict'

import { Router } from 'express';

import MetricsData from '../model/metricsdata.js';
import MetricsDefinition from '../model/metricsdefinition.js';

const metricsDataRouter = module.exports = new Router();

metricsDataRouter.post('/api/MetricsData', (req, res, next) =>
{
  const data = req.body;
  const code = data.code;
  const date = data.date;
  const value = data.value;
//  console.log('post /api/MetricsData: {code="' + code + '", date=' + date + ', value="' + value + '"}');

  MetricsData.update(
    { code: code, date: date },
    { code: code, date: date, value: value },
    { upsert: true },
    function (err, raw)
    {
      if (err) return console.log('Error=', err);
  //    console.log('The raw response from Mongo was ', raw);
    })
    .then(() => { res.send("OK"); })
    .catch(next);
})

metricsDataRouter.get('/api/MetricsData/:date', (req, res, next) =>
{
  const date = req.params.date;
//  console.log('get /api/MetricsData/' + date);

  MetricsDefinition.find().sort({ sortOrder: 1 }).exec(
    function (err, result)
    {
      let defs = result;
      if (!defs || !defs.length)
      {
        const fs = require("fs");
        const file = fs.readFileSync('MetricsDefinitions.json', 'utf8');
        const defsFromFile = JSON.parse(file);
        for (let i = 0; i < defsFromFile.length; i++)
        {
          const d = defsFromFile[i];
          defs.push({ code: d.code, description: d.description, type: d.type, color: d.color, sortOrder: (i + 1) * 100 });
        }
        MetricsDefinition.insertMany(defs).catch(next);
      }

      let counter = 0;
      for (let i = 0; i < defs.length; i++)
      {
        const query = MetricsData.findOne({ 'code': defs[i].code, 'date': date });
        query.exec().then(
          function (result)
          {
            const value = (result ? result.value : 0);
            defs[i].date = date;
            defs[i].value = value;
//            console.log(defs[i].code + " set: " + defs[i].value);
            counter++;

            if (counter == defs.length)
            {
//              console.log("before send");
              res.send(defs);
            }
          })
          .catch(next);;
      }
    }
  );
})

metricsDataRouter.get('/api/MetricsChart/:dateRange', (req, res, next) =>
{
  const moment = require("moment");

  const dateRange = req.params.dateRange;

  const totalDays = (dateRange == "7" || dateRange == "30" ? parseInt(dateRange) - 1 : 0);
  const endDate = moment();
  let startDate = moment(endDate).add(-totalDays, "days");
  const monthStart = moment(endDate.format("YYYYMM") + "01", "YYYYMMDD");
  if (dateRange == "M")
  {
    startDate = moment(monthStart).add(-6, "months");
  }
  else if (dateRange == "Q")
  {
    startDate = moment(monthStart).add(-(4 * 3 + monthStart.month() % 3), "months");
  }
  const periodCount =
    (dateRange == "M" ? 7 :
     dateRange == "Q" ? 5 :
                        parseInt(dateRange));

  const periods = new Array();
  for (let i = 0; i < periodCount; i++)
  {
    let date = moment(startDate).add(i, "days");
    if (dateRange == "M")
      date = moment(startDate).add(i, "months");
    else if (dateRange == "Q")
      date = moment(startDate).add(i * 3, "months");

    const periodName =
      (dateRange == "7"  ? date.format("dd").substring(0, 1) :
       dateRange == "30" ? date.format("M/D/YY") :
       dateRange == "M"  ? date.format("MMM-YY") :
       dateRange == "Q" ? "Q" + date.format("Q") + "-" + date.format("YY") :
                          date.format("MM/DD/YYYY"));
    const periodStart = parseInt(date.format("YYYYMMDD"));
    let periodEnd = 0;
    if (dateRange == "7" || dateRange == "30")
    {
      periodEnd = periodStart;
    }
    else if (dateRange == "M")
    {
      periodEnd = parseInt(moment(date).add(1, "months").add(-1, "days").format("YYYYMMDD"));
    }
    else if (dateRange == "Q")
    {
      periodEnd = parseInt(moment(date).add(3, "months").add(-1, "days").format("YYYYMMDD"));
    }
    const period = { periodName: periodName, periodStart: periodStart, periodEnd: periodEnd };
    periods.push(period);
  }

  //console.log(periods);

//  console.log(parseInt(startDate.format("YYYYMMDD")) + " - " + parseInt(endDate.format("YYYYMMDD")));
  const result = new Array();

  MetricsDefinition.find().sort({ sortOrder: 1 }).exec(
    function (err, defs)
    {
//      console.log(defs);

      for (let def of defs)
      {
        let totalValue = 0;

        MetricsData.find(
          {
            code: def.code,
            date: { $gte: parseInt(startDate.format("YYYYMMDD")), $lte: parseInt(endDate.format("YYYYMMDD")) }
          })
          .exec()
          .then(function (data)
          {
//            console.log(data);

            for (let d of data)
            {
              totalValue += d.value;
            }

            const chartData = new Array();

            for (let period of periods)
            {
              let periodValue = 0;
              for (let d of data)
              {
                if (d.date >= period.periodStart && d.date <= period.periodEnd)
                  periodValue += d.value;
              }
              const item = { periodName: period.periodName, value: periodValue };
              chartData.push(item);
            }

            const chart =
              {
                code: def.code,
                description: def.description,
                type: def.type,
                color: def.color,
                sortOrder: def.sortOrder,
                totalValue: totalValue,
                chartData: chartData
              };
            result.push(chart);

            if (result.length == defs.length)
            {
              result.sort((a, b) => { return (a.sortOrder > b.sortOrder ? 1 : -1); });
//              console.log(result);
              res.send(result);
            }
          })
          .catch(next);
      }
    });
})