'use strict'
module.exports = {
  NODE_ENV: '"production"',
  TOK_BOX_API_KEY: '46171452',
  SHAPE_SHIFT_URL: '"https://cors.shapeshift.io"',
  SEARCH_INDEX_URL: '"https://api.brightblock.org"',
  ETHEREUM_CONTRACT_ADDRESS: '"0x48C41e8Ecfb9fb8AB599056115ba977d5CD77fA0"',
  ETHEREUM_ABI: '[{\"constant\":false,\"inputs\":[{\"name\":\"title\",\"type\":\"string\"},{\"name\":\"hash\",\"type\":\"bytes32\"},{\"name\":\"blockstackUrl\",\"type\":\"string\"}],\"name\":\"addItem\",\"outputs\":[{\"name\":\"\",\"type\":\"int256\"}],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"auctionID\",\"type\":\"uint256\"}],\"name\":\"reclaimEscrow\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"auctionID\",\"type\":\"uint256\"}],\"name\":\"closeAuction\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"url\",\"type\":\"string\"}],\"name\":\"registerProfile\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"auctions\",\"outputs\":[{\"name\":\"itemID\",\"type\":\"uint256\"},{\"name\":\"created\",\"type\":\"uint256\"},{\"name\":\"duration\",\"type\":\"uint256\"},{\"name\":\"reserve\",\"type\":\"uint256\"},{\"name\":\"increment\",\"type\":\"uint256\"},{\"name\":\"curator\",\"type\":\"address\"},{\"name\":\"highestBid\",\"type\":\"uint256\"},{\"name\":\"highestBidder\",\"type\":\"address\"},{\"name\":\"closed\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"auctionIndex\",\"outputs\":[{\"name\":\"\",\"type\":\"int256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"itemID\",\"type\":\"uint256\"},{\"name\":\"duration\",\"type\":\"uint256\"},{\"name\":\"reserve\",\"type\":\"uint256\"},{\"name\":\"increment\",\"type\":\"uint256\"}],\"name\":\"startAuction\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"auctionID\",\"type\":\"uint256\"}],\"name\":\"getMyBid\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"auctionID\",\"type\":\"uint256\"}],\"name\":\"placeBid\",\"outputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"}],\"name\":\"profiles\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"items\",\"outputs\":[{\"name\":\"title\",\"type\":\"string\"},{\"name\":\"blockstackUrl\",\"type\":\"string\"},{\"name\":\"hash\",\"type\":\"bytes32\"},{\"name\":\"ownerIndex\",\"type\":\"uint256\"},{\"name\":\"price\",\"type\":\"uint256\"},{\"name\":\"inAuction\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"itemID\",\"type\":\"uint256\"},{\"name\":\"price\",\"type\":\"uint256\"}],\"name\":\"sell\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"itemID\",\"type\":\"uint256\"}],\"name\":\"buy\",\"outputs\":[],\"payable\":true,\"stateMutability\":\"payable\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"itemIndex\",\"outputs\":[{\"name\":\"\",\"type\":\"int256\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"bytes32\"}],\"name\":\"itemExists\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"itemID\",\"type\":\"uint256\"},{\"name\":\"ownerIndex\",\"type\":\"uint256\"}],\"name\":\"getItemOwner\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"}]'
}
