(function(mod){
    if(typeof exports == "object" && typeof model == "object") // CommonJS
        mod(require("../../lib/codemirror"));
    else if(typeof define == "function" && define.amd) //AMD
        define(["../../lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";
    CodeMirror.definMode("dbml", function(config, parseConfig) {
        var indentUnit = config.indentUnit;
        var statementIndent = parseConfig.statementIndent;
        var jsonldMode = parserConfig.jsonld;
        var jsonMode = parserConfig.json || jsonldMode;
        var trackScope = parserConfig.trackScope !== false
        var isTS = parserConfig.typescript;
        var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

        // Tokenizer
        var words = [
            'ACCOUNT', 'ACTION', 'ACTIVATED', 'ADDITIONAL', 'ADDR', 'ADDRESS', 'ADJUVANT', 'ADMIN',
            'ADVICE', 'AFTER', 'AGE', 'AGENT', 'AGENTS', 'ALLERGEN', 'ALLERGY', 'ALLOC', 'ALLOCATED',
            'ALLOCATION', 'ALLOWED', 'AMOUNT', 'AMT', 'ANONYM', 'ANTIBACTRL', 'APP', 'APPOINTED', 'APPOINTING',
            'APPOINTMENT', 'ARCHIVE', 'ARCHIVED', 'ASSESSMENT', 'AST', 'AT', 'ATHLETE', 'AUTH', 'AVAILABLE',
            'BACKUP', 'BALANCE', 'BASIC', 'BED', 'BEDSIDED', 'BEFORE', 'BEGIN', 'BILL', 'BILLING',
            'BIOLOGICAL', 'BIRTH', 'BIZ', 'BODY', 'BUSINESS', 'BY', 'CA', 'CADN', 'CALC',
            'CALCULATION', 'CALL', 'CANCEL', 'CANCELED', 'CANCELING', 'CARD', 'CARDINAL', 'CARE', 'CASH',
            'CATE', 'CATEG', 'CATEGORY', 'CAUSE', 'CD', 'CENTER', 'CERT', 'CERTIFICATE', 'CHANGE',
            'CHANNEL', 'CHARGE', 'CHARGED', 'CHARGING', 'CHECK', 'CHEMICAL', 'CHILD', 'CHINESE', 'CHRG',
            'CITY', 'CLASS', 'CLI', 'CLINIC', 'CLINICAL', 'CLOSED', 'CODE', 'COLLECTION', 'COMMODITY',
            'COMPANY', 'COMPLETED', 'COMPOUND', 'CONCEPT', 'CONCERNED', 'CONFIDENTIALITY', 'CONTACT', 'CONTAINER', 'CONTENT',
            'CONTRAST', 'CONV', 'CORRELATION', 'CORRESPONDING', 'COST', 'COUNT', 'COUNTRY', 'COUNTY', 'CREATE',
            'CREATED', 'CREDIT', 'CRITICAL', 'CRITICALITY', 'CS', 'CTRL', 'CURRENT', 'CUSTOM', 'CYCLE',
            'DATE', 'DAY', 'DAYS', 'DEACTIVATED', 'DECOCT', 'DECOCTION', 'DEFAULT', 'DEGREE', 'DEL',
            'DEPOSIT', 'DEPT', 'DESC', 'DESCRIPTION', 'DETAIL', 'DIAGNOSED', 'DIAGNOSIS', 'DIRECTION', 'DISCONTINUED',
            'DISCOUNT', 'DISEASE', 'DISPLAY', 'DIST', 'DOC', 'DOCT', 'DOCTOR', 'DOCUMENT', 'DOSAGE',
            'DOSE', 'DRIP', 'DRUG', 'DST', 'DUE', 'EDUCATION', 'ELECTRONIC', 'EMP', 'EMPLOYEE',
            'EMPLOYMENT', 'EMR', 'ENABLE', 'ENABLED', 'ENC', 'ENCOUNTER', 'END', 'ENGLISH', 'ES',
            'ESS', 'EVALUATION', 'EXAM', 'EXAMINATION', 'EXEC', 'EXP', 'EXPERIENCE', 'EXPERTISE', 'EXPIRED',
            'EXPRESS', 'EXT', 'EXTERNAL', 'EXTRACT', 'FACTOR', 'FAMILY', 'FDA', 'FILL', 'FINDINGS',
            'FIRST', 'FIX', 'FLAG', 'FORM', 'FREQ', 'FULFILLED', 'FULL', 'GENDER', 'GENERATE',
            'GENERATED', 'GESTATION', 'GIVEN', 'GRADE', 'HASH', 'HEAD', 'HERB', 'HERBAL', 'HIGH',
            'HISTORY', 'HOSPITAL', 'HOST', 'HOUSE', 'ID', 'ID2', 'IDCARD', 'IDENTIFICATION', 'IDENTITY',
            'IMAGE', 'IMG', 'IMRN', 'IN', 'INDEX', 'INFECTIOUS', 'INFO', 'INFUSION', 'INIT',
            'INSPECTION', 'INSTI', 'INSUR', 'INSURANCE', 'INTENTION', 'INTERFACE', 'INTERNAL', 'INTRO', 'INVALIDATE',
            'INVOICE', 'IP', 'IS', 'ISSUE', 'ISSUED', 'ITEM', 'JSON', 'LABTEST', 'LACTATION',
            'LATEST', 'LEVEL', 'LIMIT', 'LINK', 'LINKAGE', 'LIS', 'LIST', 'LOCATION', 'LOG',
            'MAJOR', 'MANUFACT', 'MANUFACTURER', 'MARITAL', 'MAX', 'MED', 'MEDIA', 'MEDICAL', 'MEDICATION',
            'MEDICINE', 'MEDTECH', 'MEMO', 'MERGER', 'METHOD', 'MID', 'MIN', 'MINOR', 'MOBILE',
            'MODIFIED', 'MODIFY', 'MONTH', 'MRT', 'MULTI', 'NAME', 'NATION', 'NATIONALITY', 'NATIVE',
            'NEDL', 'NEEDED', 'NEW', 'NO', 'NON', 'NONCASH', 'NOON', 'NOTES', 'NOTICE',
            'NUMBER', 'OCCUPATION', 'OCCURRED', 'OF', 'OMRN', 'ONSET', 'OPERATED', 'OPERATION', 'OPERATOR',
            'ORD', 'ORDER', 'ORG', 'ORGANIZATION', 'ORIGINAL', 'OUTGOING', 'OUTP', 'OUTPAT', 'OUTPATIENT',
            'OWNER', 'PACK', 'PAEDIATRICS', 'PAID', 'PARENT', 'PART', 'PARTIAL', 'PATIENT', 'PAYING',
            'PAYMENT', 'PERIOD', 'PERSON', 'PERSONAL', 'PHARMACOLOGY', 'PHARMACY', 'PICTURE', 'PINYIN', 'PLACE',
            'POOL', 'PORTRAIT', 'POS', 'POSITION', 'POSTAL', 'POVERTY', 'PRE', 'PREFIX', 'PREPARATION',
            'PRESC', 'PRESCRIBED', 'PRESCRIBING', 'PRESCRIPTION', 'PRI', 'PRICE', 'PRICING', 'PRIMARY', 'PRINCIPAL',
            'PRINT', 'PRINTED', 'PROCESSED', 'PROCESSING', 'PRODUCTION', 'PROFESSIONAL', 'PROHIBITED', 'PROV', 'PROVIDED',
            'PROVINCE', 'PRUDENT', 'PSYCHOTROPICS', 'PURCH', 'PURCHASE', 'PURPOSE', 'QR', 'QTY', 'QUANTITY',
            'QUEUE', 'RATE', 'RCMDD', 'REAL', 'REASON', 'REBUILD', 'RECEIPT', 'RECEPTION', 'RECIPE',
            'RECONCILIATION', 'RECORD', 'REDIATION', 'REF', 'REFUND', 'REFUNDABLE', 'REG', 'REGISTER', 'REGISTERED',
            'REGISTERING', 'REIM', 'REIMBURSE', 'RELATED', 'RELEASE', 'RELIGION', 'REPORT', 'REQ', 'REQIRED',
            'RES', 'RESOURCE', 'RESULT', 'RESYCLE', 'RET', 'RETAIL', 'RETURN', 'RETURNABLE', 'REVIEW',
            'REVIEWED', 'REVIEWER', 'RIS', 'RISK', 'ROLE', 'ROUNDING', 'ROUTE', 'RPT', 'RULE',
            'SCHED', 'SCHEDULE', 'SCHEDULED', 'SCOPE', 'SEC', 'SECRET', 'SECTION', 'SECURITY', 'SEGMENT',
            'SELECT', 'SELF', 'SEQ', 'SERIAL', 'SERVED', 'SERVICE', 'SET', 'SETTING', 'SETTLE',
            'SETTLED', 'SETTLEMENT', 'SHIFT', 'SHORTCUT', 'SIDE', 'SIGNATURE', 'SINGLE', 'SITE', 'SLOW',
            'SOID', 'SOLVENT', 'SOURCE', 'SPEC', 'SPECI', 'SPECIAL', 'SPECIMEN', 'SPLIT', 'STANDARD',
            'START', 'STATE', 'STATEMENT', 'STATUS', 'STD', 'STORAGE', 'STRATEGY', 'STRENGTH', 'SUBJ',
            'SUBJECT', 'SUBMIT', 'SUBMITTED', 'SUBSTANCE', 'SUFFIX', 'SUMMARY', 'SURGERY', 'SVC', 'SYMPTOM',
            'SYSTEM', 'TCM', 'TEAM', 'TELECOM', 'TELEPHONE', 'TEMPLATE', 'TEST', 'TEXT', 'TIME',
            'TITLE', 'TOTAL', 'TOWN', 'TRACE', 'TRANS', 'TRANSACTION', 'TREATMENT', 'TRIAGE', 'TRIAL',
            'TXN', 'TYPE', 'UNIT', 'URGENT', 'URL', 'USAGE', 'USE', 'USER', 'USING',
            'VALID', 'VALUE', 'VARIABLE', 'VARIETY', 'VERSION', 'VILLAGE', 'VISIT', 'VISITED', 'WARD',
            'WEEK', 'WIN', 'WITHDRAW', 'WITHDRAWN', 'WORK', 'WUBI', 'X', 'Y', 'Z',
        ]
        
        var types = ['NUMERIC', 'TIMESTAMP', 'VARCHAR', 'SMALLINT']

        var keywords = function(){
            function kw(type) {
                return {type: type, style: 'keyword'};
            }
            var wordRootKeyword = kw("wordRoot");
            var typeKeyword = kw("type");
            var keywordMap = new Map();
            words.forEach((value, number) => keywordMap.put(value, wordRootKeyword));
            types.forEach(value => keywordMap.put(value, typeKeyword));
            return keywordMap;
        }

        var isOperatorChar = /[+\-*&%=<>!?|~^@]/;
        
    })
})



function arrayToRegexString(array){
    let expression = '('
    array.forEach(word => {
        expression += word + '|'
    })
    expression = expression.substr(0, expression.length - 1) + ')'
    return expression
}

let typeRegex = arrayToRegexString(types)
let wordRegex = arrayToRegexString(words)

