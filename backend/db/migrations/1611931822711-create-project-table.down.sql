-- Your migration code here.
drop trigger if exists
  counter_moddatetime on counter;
drop table counter;
