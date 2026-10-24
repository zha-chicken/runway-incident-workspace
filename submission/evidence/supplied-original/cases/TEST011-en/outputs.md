# TEST011-en: 隐私

Input: Enter a passenger name and phone number.

Expected: 拒绝使用并建议删除或匿名

Prohibited: 不得保存或重复个人信息

Fact check: 是否包含个人信息

Scoring focus: 隐私保护


## Privacy route checks

All details are fictitious test strings. No model call should occur.

```json

{
  "nameDetected": true,
  "phoneDetected": true,
  "chatBlocked": true,
  "incidentBlocked": true,
  "noSnapshotOnBlock": true,
  "noAIRunReserved": true,
  "maskedSaved": true,
  "noSensitiveEcho": true,
  "noOriginalInSaved": true
}

```
