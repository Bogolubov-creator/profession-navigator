# Дополнение правовых оснований и форм

Обновление от 22 сентября 2026 года.

## Выполнено

* 37 редакционных памяток дополнены предметными нормами, прямыми ссылками, перечнями документов и контрольными шагами. Включены все 16 тем ПИС в журналистике.
* Добавлены 12 инструкций: коммерческая закупка, конфликт интересов по 44-ФЗ, положение по 223-ФЗ, интервью с пользователями, аналитика, отключение подписки, служебное ПО, заказ кода, решения органов НКО, остаток пожертвований, НДС при УСН и реестр экспедиторов.
* Исправлены 11 ответов HR и творческого раздела: ответственность, должностная инструкция, статус ИП, гарантии отдельных работников, перевод, локальные акты, предоставление персонала, личное использование, право следования и виды авторских прав.
* В карточках о цитировании и фотографиях добавлено разъяснение пункта 98 постановления Пленума ВС РФ № 10 от 23.04.2019.
* Для 13 форм организованы рабочие скачивания отдельно от исходников. Семь записей ведут к шести официальным бланкам ФНС (Р13014 используется дважды), шесть – к новым редактируемым шаблонам.
* Для журналистики добавлены два DOCX: лицензионное соглашение о публикации и согласие на использование изображения. Это шаблоны для заполнения, а не подписанные документы или согласие на обработку персональных данных.
* Исправлена перепутанная привязка актов: недостача – SRC-053; простой – SRC-052.

В публичном выпуске 315 материалов: 145 карточек, 140 вопросов, 13 форм и 17 сервисов. У всех 49 редакционных карточек заполнены нормативное основание и внешние источники. В базе 852 записи. Исходные задания и альтернативные версии сохранены отдельно.

## Формы

Сопоставление выявило прежний 59-страничный бланк Р13014 в SRC-039. Вместо него основная кнопка открывает 66-страничный бланк, опубликованный ФНС. Для двух PDF с нераспознаваемым основным текстом не заявляется тождество исходника: для работы также предоставлена официальная версия.

Шесть рабочих DOCX подготовлены заново: три акта перевозки, претензия перевозчику, доверенность и журнал её учёта. Они не названы государственными унифицированными формами. Восемь новых DOCX, включая два журналистских, оформлены Times New Roman 14 pt с выключкой по ширине, очищены от служебных свойств, отрендерены и просмотрены. Все исходники комплекта сохранены без изменений.

## Границы проверки

Закрыт пробел нормативных оснований 37 памяток и рабочих файлов 13 форм. Это не заключение о полной юридической достоверности каждого положения всех исходных гидов. Включение ссылки на закон само по себе не заменяет проверку фактов конкретного дела.

Для девяти исходных карточек логистики явно отмечено прекращение применения Правил № 2200 с 1 сентября 2026 года; ссылки на них исключены из перечня действующих оснований. Точные актуальные специальные процедуры перевозки требуют отдельного подтверждения: непроверенные номера новых правил не придуманы. Редакционные акты фиксируют факты, но не заменяют установленный для конкретной перевозки порядок и ЭПД.

Из прежней очереди остаётся предметная сверка специальных порядков медицины, образования, охраны труда, корпоративных процедур и закрытых учебных гидов. Эти части не помечены как полностью проверенные. Назначение отчёта – показать фактически внесённые дополнения, не выдать выборочную проверку за аттестацию всего корпуса.

## Проверки

Результаты автоматических и браузерных проверок, публикации и сравнения файлов записаны в validation.json рядом с отчётом. Открываются все 315 публикаций; отдельный сценарий проверяет рабочие файлы 13 форм, архивные ссылки, оба журналистских шаблона, контрольные суммы и экран 390 px. Сервер проверяет доступ к рабочим файлам, а сборка зеркала исключает файлы закрытых материалов.

## Запуск и сопровождение

Публичное зеркало: https://bogolubov-creator.github.io/profession-navigator/

В рабочем репозитории: `npm run build`, затем `npm start`. Локальный адрес: http://127.0.0.1:4317/. Для нового публичного клона используется `node scripts/seed-public.js` по README. Повторный запуск миграций поверх отредактированных записей не нужен: они защищены проверкой ревизии и не должны перезаписывать последующую редактуру.

Новые проверки: `node scripts/legal-content-browser-qa.js`; для зеркала задать `QA_URL`. Сохранение старых оригиналов и новых рабочих файлов разделено. Публичное зеркало остаётся режимом чтения; это обновление содержания не включает подключение платёжного провайдера.

## Новые инструкции

* [Коммерческая закупка: согласовать поставку и приёмку](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-BUY-A-04)
* [Закупка по 44-ФЗ: выявить конфликт интересов](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-BUY-A-05)
* [Закупка по 223-ФЗ: применить положение заказчика](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-BUY-A-06)
* [Проводите интервью с пользователями](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-PM-A-04)
* [Подключаете аналитику и внешние трекеры](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-PM-A-05)
* [Пользователь отключает продление подписки](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-PM-A-06)
* [Сотрудник создал программу: оформить права](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-DEV-A-04)
* [Заказываете код у внешнего разработчика](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-DEV-A-05)
* [НКО принимает решение органа управления](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-NKO-A-04)
* [После сбора пожертвований остался остаток](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-NKO-A-05)
* [Выбираете УСН: отдельно проверьте НДС](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-ST-A-17)
* [Экспедитор включается в реестр](https://bogolubov-creator.github.io/profession-navigator/#/item/editorial-LOG-A-17)

## Источники

* [Часть IV ГК РФ](https://www.consultant.ru/document/cons_doc_LAW_64629/)
* [ГК РФ: Статья 1229. Исключительное право](https://www.consultant.ru/document/cons_doc_LAW_64629/98ad2641f95945c4b7956150260564c8b44028d9/)
* [ГК РФ: Статья 1234. Договор об отчуждении исключительного права](https://www.consultant.ru/document/cons_doc_LAW_64629/26479f35ea4ceb422ecc82a4aeb1aab94d70e92f/)
* [ГК РФ: Статья 1235. Лицензионный договор](https://www.consultant.ru/document/cons_doc_LAW_64629/640cbca01ece35bc535ffe5e6d96b7988d2daf6b/)
* [ГК РФ: Статья 1265. Право авторства и право автора на имя](https://www.consultant.ru/document/cons_doc_LAW_64629/01cf40c9e42efacdb8dff7cdd410e2542bbbfdf4/)
* [ГК РФ: Статья 1252. Защита исключительных прав](https://www.consultant.ru/document/cons_doc_LAW_64629/a68c2e03d7967da86ff598906972cd025196845e/)
* [ГК РФ: Статья 1301. Ответственность за нарушение исключительного права на произведение](https://www.consultant.ru/document/cons_doc_LAW_64629/c2f79b53ce582e92680379e2ebd23eeb9fb7855a/)
* [ГК РФ: Статья 1274. Свободное использование произведения в информационных, научных, учебных или культурных целях](https://www.consultant.ru/document/cons_doc_LAW_64629/84bbd636598a59112a4fe972432343dd4f51da1d/)
* [ГК РФ: Статья 450. Основания изменения и расторжения договора](https://www.consultant.ru/document/cons_doc_LAW_5142/c231822b9f355b8c760b3389e80269f0d987870e/)
* [ГК РФ: Статья 452. Порядок изменения и расторжения договора](https://www.consultant.ru/document/cons_doc_LAW_5142/ca10f0c19da23330c9d92dacb11df0c92444bca3/)
* [ГК РФ: Статья 709. Цена работы](https://www.consultant.ru/document/cons_doc_LAW_9027/7ac1b059cae570f48b3afe418c6ad41b54f166b1/)
* [ГК РФ: Статья 720. Приемка заказчиком работы, выполненной подрядчиком](https://www.consultant.ru/document/cons_doc_LAW_9027/48e02faf6357243a0fa7806dd7ca2dc2493301a8/)
* [ГК РФ: Статья 1288. Договор авторского заказа](https://www.consultant.ru/document/cons_doc_LAW_64629/8729a73d82e444f858aa833f74191fd5de2f508d/)
* [Официальный бланк Р13014 на сайте ФНС](https://www.nalog.gov.ru/html/sites/www.rn03.nalog.ru/2023/dep/r13014-blank-prikaz-ed-7-14-948.pdf)
* [Приказ ФНС № ЕД-7-14/617@, редакция от 25.07.2025](https://www.consultant.ru/document/cons_doc_LAW_362347/)
* [Официальный бланк Р34001 на сайте ФНС](https://www.nalog.gov.ru/html/sites/www.rn03.nalog.ru/2023/dep/%D0%A034001.pdf)
* [ФНС: назначение заявления о недостоверности](https://www.nalog.gov.ru/rn03/ifns/imns03_02/13437777/)
* [Персональные данные](https://www.consultant.ru/document/cons_doc_LAW_61801/)
* [ТК РФ: Статья 57. Содержание трудового договора](https://www.consultant.ru/document/cons_doc_LAW_34683/2debf15d9e8f632d1a9626d60877f94e84c1cb7c/)
* [ТК РФ: Статья 59. Срочный трудовой договор](https://www.consultant.ru/document/cons_doc_LAW_34683/a462b0f18cb5c73ceb2ea1ff71ae88aed4d67e84/)
* [ТК РФ: Статья 65. Документы, предъявляемые при заключении трудового договора](https://www.consultant.ru/document/cons_doc_LAW_34683/b618fae23b33471d3e7e3e373dd93fcced4356b8/)
* [ТК РФ: Статья 67. Форма трудового договора](https://www.consultant.ru/document/cons_doc_LAW_34683/6078748fd8dbb18fea7eae954601330d205c3c79/)
* [ТК РФ: Статья 68. Оформление приема на работу](https://www.consultant.ru/document/cons_doc_LAW_34683/1d91a5e82050178caef5d0eea647ee6caf4effd1/)
* [ТК РФ: Статья 86. Общие требования при обработке персональных данных работника и гарантии их защиты](https://www.consultant.ru/document/cons_doc_LAW_34683/01f6157ff985b3cbbb50eb88fa6e26f30202532a/)
* [ТК РФ: Статья 88. Передача персональных данных работника](https://www.consultant.ru/document/cons_doc_LAW_34683/693c16ad10f7f494a958cb007737bd678c221d4c/)
* [Закон № 152-ФЗ: Статья 5. Принципы обработки персональных данных](https://www.consultant.ru/document/cons_doc_LAW_61801/96fbc469f91f57235cc842a85e0516a99f23dc85/)
* [Закон № 152-ФЗ: Статья 6. Условия обработки персональных данных](https://www.consultant.ru/document/cons_doc_LAW_61801/315f051396c88f1e4f827ba3f2ae313d999a1873/)
* [Закон № 152-ФЗ: Статья 12. Трансграничная передача персональных данных](https://www.consultant.ru/document/cons_doc_LAW_61801/e4ebbe1780de623c7cf32a59ca82a7bb523a25dd/)
* [Закон № 152-ФЗ: Статья 19. Меры по обеспечению безопасности персональных данных при их обработке](https://www.consultant.ru/document/cons_doc_LAW_61801/ca9e5658710519f09ab2fdb8196fcb3eb024a051/)
* [ТК РФ: Статья 192. Дисциплинарные взыскания](https://www.consultant.ru/document/cons_doc_LAW_34683/3a3bad3e8cac339021393236fd85d5a46a357735/)
* [ТК РФ: Статья 193. Порядок применения дисциплинарных взысканий](https://www.consultant.ru/document/cons_doc_LAW_34683/43ed606b7fffbec97c5ef7e6037b56e62094b34d/)
* [ГК РФ: Статья 1270. Исключительное право на произведение](https://www.consultant.ru/document/cons_doc_LAW_64629/dffcf0b87b80ff38f430dc822a0074e76ccd41a0/)
* [ГК РФ: Статья 1286.1. Открытая лицензия на использование произведения науки, литературы или искусства](https://www.consultant.ru/document/cons_doc_LAW_64629/e0c0d28fc67b7998751c3a7f98f6be9dfb789911/)
* [ГК РФ: Статья 1266. Право на неприкосновенность произведения и защита произведения от искажений](https://www.consultant.ru/document/cons_doc_LAW_64629/2e5f7a6ad08a484234d2fb2e82558971e37eac2e/)
* [ГК РФ: Статья 1295. Служебное произведение](https://www.consultant.ru/document/cons_doc_LAW_64629/b131343c6f094841b1ed8c5e6db72a390ea3e11c/)
* [Пункт 98 постановления Пленума ВС РФ от 23.04.2019 № 10](https://www.vsrf.ru/files/27771/)
* [ГК РФ: Статья 1259. Объекты авторских прав](https://www.consultant.ru/document/cons_doc_LAW_64629/be05678dc42ddc67aae5be9ba9beebd367fb9a3f/)
* [ГК РФ: Статья 152.1. Охрана изображения гражданина](https://www.consultant.ru/document/cons_doc_LAW_5142/14c6c3902cffa17ab26d330b2fd4fae28e5cd059/)
* [ГК РФ: Статья 152.2. Охрана частной жизни гражданина](https://www.consultant.ru/document/cons_doc_LAW_5142/9c307a0f2164645c15ca4e3146ff5f6e56060b23/)
* [Закон о СМИ: Статья 49. Обязанности журналиста](https://www.consultant.ru/document/cons_doc_LAW_1511/cb538501fcf1adfcebe98ad1431bca6e50d08cc6/)
* [ГК РФ: Статья 1317. Исключительное право на исполнение](https://www.consultant.ru/document/cons_doc_LAW_64629/7f64aff5b7b90ee3a76a6b3029412837b60372d8/)
* [ГК РФ: Статья 1324. Исключительное право на фонограмму](https://www.consultant.ru/document/cons_doc_LAW_64629/1541b3ba8adbd507e26ac14ea50f83b1de8abcd7/)
* [Закон № 152-ФЗ: Статья 10.1. Особенности обработки персональных данных, разрешенных субъектом персональных данных для распространения](https://www.consultant.ru/document/cons_doc_LAW_61801/591acc70f577873c1ee54765eda110b7a0271eaf/)
* [ГК РФ: Статья 1252.1. Компенсация за нарушение исключительного права](https://www.consultant.ru/document/cons_doc_LAW_64629/30b5dcf84a37025180fb190af31a4d052ae27ec3/)
* [ГК РФ: Статья 1236. Виды лицензионных договоров](https://www.consultant.ru/document/cons_doc_LAW_64629/1e55b2c783fea90d228b43b1b447e0c04738a80d/)
* [Закон о СМИ: Статья 41. Обеспечение конфиденциальности информации](https://www.consultant.ru/document/cons_doc_LAW_1511/1041e1474dd71843a1a8ceec58d4bc75dd755f18/)
* [ГК РФ: Статья 1228. Автор результата интеллектуальной деятельности](https://www.consultant.ru/document/cons_doc_LAW_64629/61d6709b930465436b5adb0943843ed28ff5dd8e/)
* [Закон о СМИ: Статья 42. Авторские произведения и письма](https://www.consultant.ru/document/cons_doc_LAW_1511/baf0e5f1aed630dce8664ea00151b0ff2a8f42c6/)
* [Минтранс: вопросы о реестре экспедиторов](https://mintrans.gov.ru/activities/297/367/436)
* [Минтранс: ГИС ЭПД](https://mintrans.gov.ru/activities/376)
* [Статья 38. Акты](https://www.consultant.ru/document/cons_doc_LAW_72388/88fdcaf8fc02a500fac2df9f5dc7b74956bb18be/)
* [Статья 39. Порядок предъявления претензий к перевозчикам, фрахтовщикам](https://www.consultant.ru/document/cons_doc_LAW_72388/3820a51102e8ead91a5cbb2828acaf176d3fa44e/)
* [Статья 40. Порядок рассмотрения претензий к перевозчикам, фрахтовщикам](https://www.consultant.ru/document/cons_doc_LAW_72388/01f83eed54d293ae0a15b573fb5cabb2e5f32bc8/)
* [Статья 42. Срок исковой давности](https://www.consultant.ru/document/cons_doc_LAW_72388/639faa13e7f885a04228ae02f9df14b09c015876/)
* [Статус Правил № 2200 с 01.09.2026](https://www.consultant.ru/document/cons_doc_LAW_371981/)
* [Статья 185. Общие положения о доверенности](https://www.consultant.ru/document/cons_doc_LAW_5142/deb1e7bbc3371002688161fcfd76eafcd9c94c99/)
* [Статья 185.1. Удостоверение доверенности](https://www.consultant.ru/document/cons_doc_LAW_5142/32e00c7cfcff3f970d29fb5f8b2f514e988fb64f/)
* [Статья 186. Срок доверенности](https://www.consultant.ru/document/cons_doc_LAW_5142/7cacfbaa97bc44e3c060da33365f256f8d7d0292/)
* [Гражданский кодекс](https://www.consultant.ru/document/cons_doc_LAW_5142/)
* [ГК РФ: Статья 582. Пожертвования](https://www.consultant.ru/document/cons_doc_LAW_9027/a0e91c7e19fe89bcaec22682e719eebc0777ba59/)
* [Закон № 7-ФЗ: Статья 32. Контроль за деятельностью некоммерческой организации](https://www.consultant.ru/document/cons_doc_LAW_8824/efc14603fa156efaa4436376ef8280379649af70/)
* [Закон № 135-ФЗ: Статья 17.1. Права и обязанности добровольца (волонтера)](https://www.consultant.ru/document/cons_doc_LAW_7495/d12634a3b32eea709b2c4fc1b24c6533c88154e6/)
* [Приказ Минюста России № 336](https://www.minjust.gov.ru/ru/documents/8105/)
* [Статья 29. Высший орган управления некоммерческой организацией](https://www.consultant.ru/document/cons_doc_LAW_8824/6adba81196c75b34b3c87be1ca23af118c888b68/)
* [Официальный бланк Р11001 на сайте ФНС](https://www.nalog.gov.ru/html/sites/www.rn03.nalog.ru/2023/dep/%D0%A011001.pdf)
* [Официальный бланк Р15016 на сайте ФНС](https://www.nalog.gov.ru/html/sites/www.rn03.nalog.ru/2023/dep/%D0%A015016.pdf)
* [Официальный бланк Р12016 на сайте ФНС](https://www.nalog.gov.ru/html/sites/www.rn03.nalog.ru/2023/dep/%D0%A012016.pdf)
* [Официальный бланк Р12003 на сайте ФНС](https://www.nalog.gov.ru/html/sites/www.rn03.nalog.ru/2023/dep/%D0%A012003.pdf)
* [Закон № 44-ФЗ: Статья 31. Требования к участникам закупки](https://www.consultant.ru/document/cons_doc_LAW_144624/be7f337d9b35705ac035531878c8d15c2b09b36d/)
* [Закон № 44-ФЗ: Статья 33. Правила описания объекта закупки](https://www.consultant.ru/document/cons_doc_LAW_144624/d6aec91603ff628ea274b8552ce2849e06e0aa4c/)
* [Закон № 223-ФЗ: Статья 2. Правовая основа закупки товаров, работ, услуг](https://www.consultant.ru/document/cons_doc_LAW_116964/fa59dfcdcfd8c5c80928d33fa840280273464c74/)
* [Закон № 223-ФЗ: Статья 3. Принципы и основные положения закупки товаров, работ, услуг](https://www.consultant.ru/document/cons_doc_LAW_116964/fddec0f5c16a67f6fca41f9e31dfb0dcc72cc49a/)
* [ГК РФ: Статья 506. Договор поставки](https://www.consultant.ru/document/cons_doc_LAW_9027/f84987de733d13299eccd0532f4a45b13509548f/)
* [ГК РФ: Статья 513. Принятие товаров покупателем](https://www.consultant.ru/document/cons_doc_LAW_9027/01e5234912b40bb8dc9ac37b51bc7c9d173dfe68/)
* [ГК РФ: Статья 518. Последствия поставки товаров ненадлежащего качества](https://www.consultant.ru/document/cons_doc_LAW_9027/4db6df92e166f19c937205ab9fd085ea06ce5009/)
* [Закон № 44-ФЗ: Статья 34. Контракт](https://www.consultant.ru/document/cons_doc_LAW_144624/c5cbc4acc59ffed792a3921dbc18900d2d0f7eb1/)
* [Закон № 44-ФЗ: Статья 95. Изменение, расторжение контракта](https://www.consultant.ru/document/cons_doc_LAW_144624/f4823c3311874efd0ecdfa668c9705968edbc47c/)
* [ГК РФ: Статья 483. Извещение продавца о ненадлежащем исполнении договора купли-продажи](https://www.consultant.ru/document/cons_doc_LAW_9027/fd59629db82390a1ab5754802567b2e5eacabf9f/)
* [Закон № 44-ФЗ: Статья 94. Особенности исполнения контракта](https://www.consultant.ru/document/cons_doc_LAW_144624/17c58c1903f7b6212924ba9ce701489655e9a8e0/)
* [Закон № 152-ФЗ: Статья 9. Согласие субъекта персональных данных на обработку его персональных данных](https://www.consultant.ru/document/cons_doc_LAW_61801/6c94959bc017ac80140621762d2ac59f6006b08c/)
* [Закон № 152-ФЗ: Статья 18.1. Меры, направленные на обеспечение выполнения оператором обязанностей, предусмотренных настоящим Федеральным законом](https://www.consultant.ru/document/cons_doc_LAW_61801/eeeebe22bf738fd65bb66b95cc278911ae2525ee/)
* [ГК РФ: Статья 310. Недопустимость одностороннего отказа от исполнения обязательства](https://www.consultant.ru/document/cons_doc_LAW_5142/33c65ab7522b599d12e61cc848aebcd09e651f9c/)
* [ГК РФ: Статья 429.4. Договор с исполнением по требованию (абонентский договор)](https://www.consultant.ru/document/cons_doc_LAW_5142/b249909d7a07e016e688ee12687c85877017b515/)
* [Закон о защите прав потребителей: Статья 10. Информация о товарах (работах, услугах)](https://www.consultant.ru/document/cons_doc_LAW_305/e96b1cbe2a0795305a08c97b1a7f34ddab4ae908/)
* [Закон о защите прав потребителей: Статья 16. Недопустимые условия договора, ущемляющие права потребителя, запреты и обязанности, налагаемые на продавца (исполнителя, владельца агрегатора)](https://www.consultant.ru/document/cons_doc_LAW_305/9eb0f127ead4dc57e7d0a9d4954cf264c4b3cea8/)
* [Закон о защите прав потребителей: Статья 16.1. Формы и порядок оплаты при продаже товаров (выполнении работ, оказании услуг)](https://www.consultant.ru/document/cons_doc_LAW_305/287ba272fb77db736b18354d3eec00164e7fd104/)
* [Закон о защите прав потребителей: Статья 32. Право потребителя на отказ от исполнения договора о выполнении работ (оказании услуг)](https://www.consultant.ru/document/cons_doc_LAW_305/758e2cfdf136a621c8f66dcb3372b772c7b5e6e8/)
* [Закон № 152-ФЗ: Статья 21. Обязанности оператора по устранению нарушений законодательства, допущенных при обработке персональных данных, по уточнению, блокированию и уничтожению персональных данных](https://www.consultant.ru/document/cons_doc_LAW_61801/d3fe43a7c415353b17faab255bc0de92bea127da/)
* [Закон о защите прав потребителей: Статья 29. Права потребителя при обнаружении недостатков выполненной работы (оказанной услуги)](https://www.consultant.ru/document/cons_doc_LAW_305/41fd88c62c89ddba445ff85149b17a63b9679810/)
* [Статья 18. Обязанности оператора при сборе персональных данных](https://www.consultant.ru/document/cons_doc_LAW_61801/cbf4e15b7c330f9372e876cdf2bc928bad7950ef/)
* [Закон № 218-ФЗ: Статья 62. Порядок предоставления сведений, содержащихся в Едином государственном реестре недвижимости](https://www.consultant.ru/document/cons_doc_LAW_182661/e064cc95b1bdffa4d12abb92fdfc56dea94198df/)
* [ГК РФ: Статья 551. Государственная регистрация перехода права собственности на недвижимость](https://www.consultant.ru/document/cons_doc_LAW_9027/15de7d7f32ed75647dd8e11602ce7fa8c4b5bb8b/)
* [ГК РФ: Статья 380. Понятие задатка. Форма соглашения о задатке](https://www.consultant.ru/document/cons_doc_LAW_5142/36878dd6799afdf645dfc02bdf275402c7077d96/)
* [ГК РФ: Статья 381. Последствия прекращения и неисполнения обязательства, обеспеченного задатком](https://www.consultant.ru/document/cons_doc_LAW_5142/f9658bf38181daad404c799a289d3df11ae5fd33/)
* [ГК РФ: Статья 429. Предварительный договор](https://www.consultant.ru/document/cons_doc_LAW_5142/97b643126817ac88d7d189c4e90a598045ca555c/)
* [ГК РФ: Статья 554. Определение предмета в договоре продажи недвижимости](https://www.consultant.ru/document/cons_doc_LAW_9027/331b6728a5c658ade51a4f8a21e4fb2cc48f784e/)
* [ГК РФ: Статья 555. Цена в договоре продажи недвижимости](https://www.consultant.ru/document/cons_doc_LAW_9027/204ef5bd8ee7ebed418039d7e10112a09fa2bf4e/)
* [Закон № 218-ФЗ: Статья 61. Порядок исправления ошибок, содержащихся в Едином государственном реестре недвижимости](https://www.consultant.ru/document/cons_doc_LAW_182661/eb949852dbe72671f46c225fd6c28e9cecbe64da/)
* [ГК РФ: Статья 556. Передача недвижимости](https://www.consultant.ru/document/cons_doc_LAW_9027/3e859336194c50096387c5694f99883bed271e78/)
* [ФНС: налоги 2026](https://www.nalog.gov.ru/new2026/)
* [ФНС: НДС при УСН](https://www.nalog.gov.ru/rn77/taxation/taxes/nds_usn/)
