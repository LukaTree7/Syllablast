const Config1: string[][] = [
    ['in', 'vis', 'i', 'ble'],
    ['im', 'mac', 'u', 'late'],
    ['af', 'fil', 'i', 'ate'],
    ['un', 'der', 'wa', 'ter']
];

const Config2: string[][] = [
    ['ex', 'am', 'in', 'ing'],
    ['re', 'in', 'force', 'ment'],
    ['in', 'for', 'ma', 'tive'],
    ['ma', 'te', 'ri', 'al']
];

const Config3: string[][] = [
    ['me', 'chan', 'i', 'cal'],
    ['cal', 'cu', 'lat', 'ing'],
    ['im', 'me', 'di', 'ate'],
    ['di', 'ag', 'on', 'al']
];

const initial_config1: string[][] = [
    [Config1[3][3], Config1[2][3], Config1[0][3], Config1[3][1]],
    [Config1[2][1], Config1[0][0], Config1[1][0], Config1[0][2]],
    [Config1[2][2], Config1[1][3], Config1[1][1], Config1[3][0]],
    [Config1[1][2], Config1[0][1], Config1[2][0], Config1[3][2]]
];

const initial_config2: string[][] = [
    [Config2[1][2], Config2[1][3], Config2[3][3], Config2[0][2]], 
    [Config2[2][1], Config2[2][2], Config2[0][1], Config2[1][1]], 
    [Config2[2][3], Config2[3][0], Config2[0][3], Config2[2][0]],
    [Config2[3][2], Config2[1][0], Config2[3][1], Config2[0][0]]
];

const initial_config3: string[][] = [
    [Config3[3][3], Config3[2][2], Config3[0][0], Config3[3][0]], 
    [Config3[1][1], Config3[0][3], Config3[1][0], Config3[2][1]],
    [Config3[1][2], Config3[2][0], Config3[1][3], Config3[0][2]],
    [Config3[3][2], Config3[2][3], Config3[3][1], Config3[0][1]]
];

export{ Config1, Config2, Config3, initial_config1, initial_config2, initial_config3 }