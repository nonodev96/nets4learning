# DataFrameUtils

<details>
<summary class="n4l-summary">DataFrameTransform</summary>

```js
function DataFrameTransform (dataframe, dataframe_transforms): DataFrame {}
```

| Parameters | Type                                | Description | Default |
|------------|-------------------------------------|-------------|---------|
| dataframe  | `EncoderMap_t`                      |             |         |
| transforms | `Array<DataFrameColumnTransform_t>` |             |         |


[//]: # (```js)
[//]: # (/**)
[//]: # ( * @param {dfd.DataFrame}                dataframe)
[//]: # ( * @param {DataFrameColumnTransform_t[]} dataframe_transforms)
[//]: # ( * @return {dfd.DataFrame})
[//]: # ( */)
[//]: # (export function DataFrameTransform &#40;dataframe, dataframe_transforms&#41; {})
[//]: # (```)

</details>

---

<details>
<summary class="n4l-summary">@type DataFrameColumnTransform_t</summary>

```js
/**
 * @typedef {'one-hot-encoder'|'label-encoder'|'int32'|'float32'|'string'|'drop'|'dropNa'|'dropNa'|'ignored'} Transform_t
 */

/**
 * @typedef DataFrameColumnTransform_t
 * @property {string} column_name
 * @property {Transform_t} column_transform
 */
```

</details>

---

<details>
<summary class="n4l-summary">DataFrameEncoder</summary>

```js
function DataFrameEncoder (dataframe, transforms): EncoderMap_t {}
```

| Parameters | Type                                        | Description                                                            | Default |
|------------|---------------------------------------------|------------------------------------------------------------------------|---------|
| dataframe  | `DataFrame`                                 | Two-dimensional, size-mutable, potentially heterogeneous tabular data. | -       |
| transforms | `Array<'label-encoder'\|'one-hot-encoder'>` |                                                                        | -       |


[//]: # (```js)
[//]: # (/**)
[//]: # ( *)
[//]: # ( * @param {dfd.DataFrame}                            dataframe)
[//]: # ( * @param {Array<'label-encoder'|'one-hot-encoder'>} dataframe_transforms)
[//]: # ( * @return {EncoderMap_t})
[//]: # ( */)
[//]: # (export function DataFrameEncoder &#40;dataframe, dataframe_transforms&#41; {})
[//]: # (```)

</details>

---

<details>
<summary class="n4l-summary">DataFrameApplyEncoders</summary>

```js
function DataFrameApplyEncoders (encoders_map, values_map, column_name_list): number[] {}
```

| Parameters       | Type                   | Description | Default |
|------------------|------------------------|-------------|---------|
| encoders_map     | `EncoderMap_t`         |             |         |
| values_map       | `Object.<string\|any>` |             |         |
| column_name_list | `Array<string>`        |             |         |

[//]: # (```js)
[//]: # (/**)
[//]: # ( *)
[//]: # ( * @param {EncoderMap_t}         encoders_map)
[//]: # ( * @param {Object.<string, any>} values_map)
[//]: # ( * @param {string[]}             column_name_list)
[//]: # ( * @returns {number[]})
[//]: # ( */)
[//]: # (function DataFrameApplyEncoders &#40;encoders_map, values_map, column_name_list&#41; {})
[//]: # (```)

</details>

---

<details>
<summary class="n4l-summary">DataFrameApplyEncodersVector</summary>

```js
function DataFrameApplyEncodersVector (encoders_map, input_data, column_name_list): number[] {}
```

| Parameters       | Type                    | Description | Default |
|------------------|-------------------------|-------------|---------|
| encoders_map     | `EncoderMap_t`          |             |         |
| input_data       | `Array<string\|number>` |             |         |
| column_name_list | `Array<string>`         |             |         |

[//]: # (```js)
[//]: # (/**)
[//]: # ( *)
[//]: # ( * @param {EncoderMap_t}         encoders_map)
[//]: # ( * @param {Array<string|number>} input_data)
[//]: # ( * @param {string[]}             column_name_list)
[//]: # ( * @return {number[]})
[//]: # ( */)
[//]: # (export function DataFrameApplyEncodersVector &#40;encoders_map, input_data, column_name_list&#41; {})
[//]: # (```)

</details>

---

<details>
<summary class="n4l-summary">@type EncoderMap_t</summary>

```js
/**
 * @typedef {Object} EncoderObject_t
 * @property {'label-encoder' | 'one-hot-encoder'} type
 * @property {dfd.LabelEncoder | dfd.OneHotEncoder} encoder
 */

/**
 * @typedef {Object.<string, EncoderObject_t>} EncoderMap_t
 */
```

</details>

