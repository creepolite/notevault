create table if not exists users(
    id int primary key autoincrement,
    email text unique not null,
    pasword text not null
);

create table if not exists notes(
    id integer primary key autoincrement,
    user_id integer not null,
    title text not null,
    content text,
    created_at datetime default curremt_timestamp,
    foreign key (user_id) references users(id)
);
