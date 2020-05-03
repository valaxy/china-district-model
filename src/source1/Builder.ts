import { District } from "../District"
import * as assert from 'assert'

import province_object = require('./province_object.json')
import city_object = require('./city_object.json')
import county_object = require('./county_object.json')

const chinaAdcode = '100000'

// 数据源来自：https://github.com/wecatch/china_regions
// 数据最后更新时间：2019年
export class Builder {
    private _adcodeToRecord: Map<string, District> = new Map

    get country() { return this._adcodeToRecord.get(chinaAdcode) }

    get adcodeToRecord() { return this._adcodeToRecord }

    constructor() {
        this._buildCountry()
        this._buildProvince()
        this._buildCity()
        this._buildCounty()
    }

    private _setRecord(record: District) {
        // parent必须存在
        if (record.level != 'country') {
            assert(record.parent, `${record.name} - ${record.adcode} should exist parent`)
        }


        assert(!this._adcodeToRecord.has(record.adcode), `${record.adcode} should not exist`)
        this._adcodeToRecord.set(record.adcode, record)
    }

    private _buildCountry() {
        this._setRecord(new District({
            adcode: chinaAdcode,
            name: '全国',
            level: 'country',
        }))
    }

    private _buildProvince() {
        Object.values(province_object).forEach((province: any) => {
            let adcode = province.id.slice(0, 6) // 使用简化编码
            this._setRecord(new District({
                adcode,
                parent: this.country,
                name: province.name,
                level: 'province'
            }))
        })
    }


    private _buildCity() {
        Object.values(city_object).forEach((city: any) => {
            let adcode = city.id.slice(0, 6) // 使用简化编码
            let parentProvinceAdcode = `${city.id.slice(0, 2)}0000`
            let parentProvince = this._adcodeToRecord.get(parentProvinceAdcode)
            assert.equal(parentProvince.level, 'province')

            this._setRecord(new District({
                adcode,
                parent: parentProvince,
                name: city.name,
                level: 'city'
            }))
        })
    }


    private _buildCounty() {
        Object.values(county_object).forEach((county: any) => {
            let adcode = county.id.slice(0, 6) // 使用简化编码
            let parentCityAdcode = `${county.id.slice(0, 4)}00`
            let parentCity = this._adcodeToRecord.get(parentCityAdcode)
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
