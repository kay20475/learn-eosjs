#include <eosio/eosio.hpp>

class [[eosio::contract]] iloveeosio11 : public eosio::contract {
 public:
  using eosio::contract::contract;

  // add data
  [[eosio::action]] void adddata(uint64_t index) {
    require_auth(get_self());
    _data datas(get_self(), get_self().value);
    datas.emplace(get_self(), [&](auto& d) {
      d.id = datas.available_primary_key();
      d.index = index;
    });
  }

  // delete data
  [[eosio::action]] void deldata(uint64_t id) {
    require_auth(get_self());
    _data datas(get_self(), get_self().value);
    auto itr = datas.require_find(id, "id not exists.");
    datas.erase(itr);
  }

  struct [[eosio::table]] data {
    uint64_t id;
    uint64_t index;

    uint64_t primary_key() const { return id; }
  };

  using _data = eosio::multi_index<"data"_n, data>;
};