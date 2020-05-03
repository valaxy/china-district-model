import { District } from "../District"
import * as assert from 'assert'

import provinceObject = require('./provinces.json')
import cityObject = require('./cities.json')
import countyObject = require('./counties.json')
import specialCities = require('./specialCities.json')

const chinaAdcode = '100000'


// 数据源来自：https://github.com/modood/Administrative-divisions-of-China
// 数据最后更新时间：2020年
export class Builder {
    private _adcodeToRecord: Map<string, District> = new Map
    private _specialCitiesSet: Set<typeof specialCities.specialCities[0]>

    get country() { return this._adcodeToRecord.get(chinaAdcode) }

    get adcodeToRecord() { return this._adcodeToRecord }

    constructor() {
        this._specialCitiesSet = new Set(specialCities.specialCities)
        this._buildCountry()
        this._buildProvince()
        this._buildCity()
        this._buildCounty()
    }

    private _setRecord(record: District) {
        if (!record.parent) {
            assert(record.parent, `${record.name} - ${record.adcode} should exist parent`)
            return
        }

        assert(!this._adcodeToRecord.has(record.adcode), `${record.name} - ${record.adcode} should not exist`)
        this._adcodeToRecord.set(record.adcode, record)
        record.parent.children.push(record)
    }

    private _buildCountry() {
        this._adcodeToRecord.set(chinaAdcode, new District({
            adcode: chinaAdcode,
            name: '全国',
            level: 'country',
        }))
    }

    private _buildProvince() {
        Object.values(provinceObject).forEach((province: any) => {
            let adcode = `${province.code}0000`
            this._setRecord(new District({
                adcode,
                parent: this.country,
                name: province.name,
                level: 'province'
            }))
        })
    }

    private _buildCity() {
        Object.values(cityObject).forEach((city: any) => {
            let adcode = `${city.code}00`
            let parentProvinceAdcode = `${city.provinceCode}0000`
            let parentProvince = this._adcodeToRecord.get(parentProvinceAdcode)
            if (!parentProvince) { return assert(false) }
            assert(parentProvince.level, 'province')

            this._setRecord(new District({
                adcode,
                parent: parentProvince,
                name: city.name,
                level: 'city'
            }))
        })
    }


    private _buildCounty() {
        Object.values(countyObject).forEach((county: any) => {
            let adcode = county.code

            // 特殊城市是没有县级行政单位的，为防止出现冲突，从counties里移除
            if (this._specialCitiesSet.has(adcode)) {
                return
            }

            let parentCityAdcode = `${county.cityCode}00`
            let parentCity = this._adcodeToRecord.get(parentCityAdcode)
            if (!parentCity) { return assert(false) }
            assert.equal(parentCity.level, 'city')

            this._setRecord(new District({
                adcode,
                parent: parentCity,
                name: county.name,
                level: 'county'
            }))
        })
    }
}
