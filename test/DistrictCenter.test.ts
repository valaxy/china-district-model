import { DistrictCenter } from '../src'
import { assert } from 'chai'

describe(DistrictCenter.name, function () {
    let center = new DistrictCenter()

    it('case', function () {
        let china = 0
        let provinceCount = 0
        let cityCount = 0
        let countyCount = 0
        center.forEach(dis => {
            switch (dis.level) {
                case 'country':
                    china += 1
                    break
                case 'province':
                    provinceCount += 1
                    break
                case 'city':
                    cityCount += 1
                    break
                case 'county':
                    countyCount += 1
                    break

                default:
                    assert.fail()

            }
        })

        assert.equal(china, 1)
        assert.equal(provinceCount, 31)
        assert.equal(cityCount, 342)
        assert.equal(countyCount, 2992)

        // assert.equal(cityCount, 343)
        // assert.equal(countyCount, 3285)
    })

    it('getDistrictByName()', function () {
        assert.equal(center.country.adcode, '100000')
    })

    it('getOwnerProvince()', function () {
        assert.equal(center.getOwnerProvince('500100').adcode, '500000')
        assert.equal(center.getOwnerProvince('500110').adcode, '500000')
        assert.equal(center.getOwnerProvince('429000').adcode, '420000')
    })


    it('childrenCount', function () {
        let leafs = center.getLeafs()
        let leafAdcodes = leafs.map(l => l.adcode)
        assert.equal(leafs.length, 2995)
        assert(leafAdcodes.includes('441900'))
        assert(leafAdcodes.includes('442000'))
        assert(leafAdcodes.includes('460400'))
    })
})
