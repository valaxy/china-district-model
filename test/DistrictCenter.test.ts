import { DistrictCenter } from '../src'
import { assert } from 'chai'

describe(DistrictCenter.name, function () {
    let center = new DistrictCenter()

    it('重庆市', function () {
        let p = center.getByAdcode('500000')
        assert.equal(p.name, '重庆市')

        let c = center.getByAdcode('500100')
        assert.equal(c.name, '市辖区')
        assert.equal(c.parent.name, '重庆市')

        let co = center.getByAdcode('500105')
        assert.equal(co.name, '江北区')
        assert.equal(co.parent.name, '市辖区')
        assert.equal(co.parent.parent.name, '重庆市')
    })

    it('District._findDescendantsByName()', function () {
        let d = center.getByAdcode('500000')
        let ds = d['_findDescendantsByName']('市辖区')
        assert.equal(ds.length, 1)

        assert.equal(d['_findDescendantsByName']('北碚区').length, 1)
        assert.equal(d['_findDescendantsByName']('石柱土家族自治县').length, 1)
    })

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
