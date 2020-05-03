import { District } from '../src'
import { assert } from 'chai'

describe(District.name, function () {
    it('case', function () {
        let d = new District({
            adcode: '123456',
            name: 'XYZ',
            level: 'county'
        })

        assert.equal(d.adcode, '123456')
        assert.equal(d.name, 'XYZ')
        assert.equal(d.level, 'county')
    })

    it('existChildByName()/findOneChildByName()', function () {
        let d = new District({
            adcode: '300000',
            name: 'AAA',
            level: 'city'
        })
        let c = new District({
            adcode: '300001',
            name: '111',
            level: 'county'
        })
        d.children.push(c)

        assert.isOk(d.existChildByName('111'))
        assert.isOk(!d.existChildByName('11'))

        assert.equal(d.findOneChildByName('111'), c)
        assert.throws(() => d.findOneChildByName('sss'))

    })
})
