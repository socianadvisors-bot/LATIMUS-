/** All monetary amounts are integer cents. Basis points: 10,000 = 100%. */
const MAX=Number.MAX_SAFE_INTEGER;
function integer(value:number,label:string,min=0){if(!Number.isSafeInteger(value)||value<min)throw new Error(`${label} must be a safe integer >= ${min}`);return value}
function cents(value:bigint):number{if(value>BigInt(MAX)||value< -BigInt(MAX))throw new Error('Calculation exceeds safe monetary range');return Number(value)}
function add(values:number[]):number{return cents(values.reduce((sum,v)=>sum+BigInt(integer(v,'Amount',-MAX)),0n))}
function roundRatio(n:bigint,d:bigint):number{if(d<=0n)throw new Error('Divisor must be positive');const negative=n<0n;const absolute=negative?-n:n;return cents((negative?-1n:1n)*((absolute+d/2n)/d))}
function bps(value:number,label:string,max=10000){integer(value,label);if(value>max)throw new Error(`${label} exceeds ${max} basis points`);return value}
export interface PricingInput {labor:{hours:number;rateCents:number}[];directCostsCents:number;contingencyBps?:number;targetMarginBps?:number;floorMarginBps?:number}
export interface PricingResult {baseCents:number;contingencyCents:number;costCents:number;priceCents:number;profitCents:number;marginBps:number;markupBps:number;requiresException:boolean}
export function priceEngagement(input:PricingInput):PricingResult {
  const contingency=bps(input.contingencyBps??1000,'Contingency');const margin=bps(input.targetMarginBps??5000,'Target gross margin',9999);const floor=bps(input.floorMarginBps??4000,'Floor margin',9999);
  if(!input.labor.length)throw new Error('At least one approved labor estimate is required');
  const labor=input.labor.map(({hours,rateCents})=>{if(!Number.isFinite(hours)||hours<0||Math.abs(hours*100-Math.round(hours*100))>0.0000001)throw new Error('Hours must be nonnegative in 0.01 hour increments');const hundredths=integer(Math.round(hours*100),'Hours');return roundRatio(BigInt(hundredths)*BigInt(integer(rateCents,'Loaded hourly cost')),100n)});
  const baseCents=add([...labor,integer(input.directCostsCents,'Direct costs')]);const contingencyCents=roundRatio(BigInt(baseCents)*BigInt(contingency),10000n);const costCents=add([baseCents,contingencyCents]);
  const priceCents=roundRatio(BigInt(costCents)*10000n,BigInt(10000-margin));const profitCents=priceCents-costCents;
  const marginBps=priceCents?roundRatio(BigInt(profitCents)*10000n,BigInt(priceCents)):0;const markupBps=costCents?roundRatio(BigInt(profitCents)*10000n,BigInt(costCents)):0;
  return {baseCents,contingencyCents,costCents,priceCents,profitCents,marginBps,markupBps,requiresException:costCents>0&&marginBps<floor};
}
export function cashForecast(openingCents:number,periods:{inflowsCents:number;outflowsCents:number}[]):{openingCents:number;inflowsCents:number;outflowsCents:number;closingCents:number}[]{
  let balance=integer(openingCents,'Opening balance',-MAX);return periods.map(p=>{const openingCents=balance;integer(p.inflowsCents,'Inflows');integer(p.outflowsCents,'Outflows');balance=add([balance,p.inflowsCents,-p.outflowsCents]);return {...p,openingCents,closingCents:balance}});
}
export function constructionEAC(input:{budgetCents:number;actualCents:number;remainingCents:number;approvedChangeCents:number}):{revisedBudgetCents:number;eacCents:number;varianceCents:number}{
  const revisedBudgetCents=add([integer(input.budgetCents,'Budget'),integer(input.approvedChangeCents,'Approved change',-MAX)]);const eacCents=add([integer(input.actualCents,'Actual cost'),integer(input.remainingCents,'Remaining estimate')]);return {revisedBudgetCents,eacCents,varianceCents:add([revisedBudgetCents,-eacCents])};
}
export function realEstateNOI(input:{grossRentCents:number;vacancyBps:number;otherIncomeCents:number;operatingExpenseCents:number;propertyValueCents:number}):{effectiveIncomeCents:number;noiCents:number;capRateBps:number|null}{
  const vacancy=bps(input.vacancyBps,'Vacancy');const rent=integer(input.grossRentCents,'Gross rent');const effectiveIncomeCents=add([roundRatio(BigInt(rent)*BigInt(10000-vacancy),10000n),integer(input.otherIncomeCents,'Other income')]);const noiCents=add([effectiveIncomeCents,-integer(input.operatingExpenseCents,'Operating expense')]);const value=integer(input.propertyValueCents,'Property value');return {effectiveIncomeCents,noiCents,capRateBps:value?roundRatio(BigInt(noiCents)*10000n,BigInt(value)):null};
}
export function fleetEconomics(input:{revenueCents:number;fuelCents:number;laborCents:number;maintenanceCents:number;otherCents:number;miles:number}):{costCents:number;profitCents:number;costPerMileCents:number|null}{
  const costCents=add([input.fuelCents,input.laborCents,input.maintenanceCents,input.otherCents].map(v=>integer(v,'Fleet cost')));integer(input.miles,'Miles');return {costCents,profitCents:add([integer(input.revenueCents,'Revenue'),-costCents]),costPerMileCents:input.miles?roundRatio(BigInt(costCents),BigInt(input.miles)):null};
}
export function energyPayback(input:{capexCents:number;annualSavingsCents:number;annualOpexCents:number}):{annualNetCents:number;simplePaybackYears:number|null}{
  const capex=integer(input.capexCents,'Capital cost');const annualNetCents=add([integer(input.annualSavingsCents,'Annual savings'),-integer(input.annualOpexCents,'Annual operating costs')]);return {annualNetCents,simplePaybackYears:annualNetCents>0?Math.round(capex/annualNetCents*100)/100:null};
}
export function enterpriseValue(input:{ebitdaCents:number;multipleHundredths:number;debtCents:number;cashCents:number}):{enterpriseValueCents:number;equityValueCents:number}{
  const ev=roundRatio(BigInt(integer(input.ebitdaCents,'EBITDA',-MAX))*BigInt(integer(input.multipleHundredths,'Multiple')),100n);return {enterpriseValueCents:ev,equityValueCents:add([ev,-integer(input.debtCents,'Debt'),integer(input.cashCents,'Cash')])};
}
export function parseMoney(value:string):number{if(!/^-?\d+(?:\.\d{1,2})?$/.test(value.trim()))throw new Error('Use a monetary amount with at most two decimal places');const negative=value.trim().startsWith('-');const [whole,fraction='']=value.trim().replace(/^-/,'').split('.');return cents((negative?-1n:1n)*(BigInt(whole)*100n+BigInt(fraction.padEnd(2,'0'))))}
export function formatMoney(value:number,currency='USD'):string{integer(value,'Amount',-MAX);return new Intl.NumberFormat('en-US',{style:'currency',currency,maximumFractionDigits:2}).format(value/100)}
