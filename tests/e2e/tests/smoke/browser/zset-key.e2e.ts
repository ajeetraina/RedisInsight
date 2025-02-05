import { rte } from '../../../helpers/constants';
import { acceptLicenseTermsAndAddDatabase, deleteDatabase } from '../../../helpers/database';
import { BrowserPage } from '../../../pageObjects';
import { commonUrl, ossStandaloneConfig } from '../../../helpers/conf';
import { Chance } from 'chance';

const browserPage = new BrowserPage();
const chance = new Chance();

let keyName = chance.word({ length: 10 });
const keyTTL = '2147476121';
const keyMember = '1111ZsetMember11111';
const score = '0';

fixture `ZSet Key fields verification`
    .meta({ type: 'smoke' })
    .page(commonUrl)
    .beforeEach(async () => {
        await acceptLicenseTermsAndAddDatabase(ossStandaloneConfig, ossStandaloneConfig.databaseName);
    })
    .afterEach(async () => {
        //Clear and delete database
        await browserPage.deleteKeyByName(keyName);
        await deleteDatabase(ossStandaloneConfig.databaseName);
    })
test
    .meta({ rte: rte.standalone })
    ('Verify that user can add members to Zset', async t => {
        keyName = chance.word({ length: 10 });
        await browserPage.addZSetKey(keyName, '5', keyTTL);
        //Add member to the ZSet key
        await browserPage.addMemberToZSet(keyMember, score);
        //Check the added member
        await t.expect(browserPage.zsetMembersList.withExactText(keyMember).exists).ok('The existence of the Zset member', { timeout: 20000 });
        await t.expect(browserPage.zsetScoresList.withExactText(score).exists).ok('The existence of the Zset score', { timeout: 20000 });
    });
test
    .meta({ rte: rte.standalone })
    ('Verify that user can remove member from ZSet', async t => {
        keyName = chance.word({ length: 10 });
        await browserPage.addZSetKey(keyName, '6', keyTTL);
        //Add member to the ZSet key
        await browserPage.addMemberToZSet(keyMember, score);
        //Remove member from the key
        await t.click(browserPage.removeZserMemberButton);
        await t.click(browserPage.confirmRemovZSetMemberButton);
        //Check the notification message
        const notofication = await browserPage.getMessageText();
        await t.expect(notofication).contains('Member has been removed', 'The notification');
    });
