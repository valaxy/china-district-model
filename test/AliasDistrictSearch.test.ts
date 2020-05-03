import { AliasDistrictSearch, DistrictCenter } from '../src'
import * as assert from 'assert'

describe(AliasDistrictSearch.name, function () {
    let center = new DistrictCenter()

    it('getAllAlias()', function () {
        let search = new AliasDistrictSearch(center, {
            alias: {}
        })
        // assert.equal(search.getAllAlias().length, 26531)

        let search2 = new AliasDistrictSearch(center, {
            alias: {
                北京市: ['北京']
            }
        })
        // assert.equal(search2.getAllAlias().length, 26599)
        assert.deepEqual(search2.getByAlias('湖南省长沙市'), search2.getByAlias('长沙市'))
    })
})
