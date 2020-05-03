import * as assert from 'assert'

export type DistrictLevel
    = 'country'
    | 'province'
    | 'city'
    | 'county'


export class District {
    private _adcode: string                 // 当前区域行政编码
    private _name: string                   // 当前区域的名称（例如长沙市，不保证name符合固定的规范，也可能是长沙）
    private _level: DistrictLevel           // 当前级别

    private _parent: District | undefined           // 上级行政区域
    private _children: District[] = []              // 下级行政区域

    get adcode() { return this._adcode }

    get name() { return this._name }

    get level() { return this._level }

    get parent() { return this._parent }

    get children() { return this._children }

    get childrenCount() { return this._children.length }

    constructor(props: {
        adcode: string
        name: string
        level: DistrictLevel
        parent?: District
    }) {
        this._adcode = props.adcode
        this._name = props.name
        this._level = props.level
        this._parent = props.parent
    }

    existChildByName(name: string): boolean {
        return !!this.children.find(child => child.name == name)
    }

    findOneChildByName(name: string): District {
        let districts = this.children.filter(child => child.name == name)
        assert.equal(districts.length, 1, `name=${name} exist multiply District`)
        return districts[0]
    }
}
