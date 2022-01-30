require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/v8nArqYacOIkGIjsYYzcKQVjyCY_YSMe',
      accounts: ['d2ea445c21ccae85e9abebdcf3ceae1e281dc33667c20727593cffae9cd7ebf9'],
    },
  },
}; 