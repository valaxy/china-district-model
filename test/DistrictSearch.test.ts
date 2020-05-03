import { DistrictCenter, DistrictSearch } from '../src'
import * as assert from 'assert'

describe(DistrictSearch.name, function () {
    let center = new DistrictCenter()
    let search = new DistrictSearch(center)

    it('getByName()', function () {
        // assert.equal(search.getByName('市辖区', 'county').length, 282)
        assert.deepEqual(search.findByName('湖南省', 'city'), [])
        assert.deepEqual(search.findByName('xx', 'county'), [])
    })
})
