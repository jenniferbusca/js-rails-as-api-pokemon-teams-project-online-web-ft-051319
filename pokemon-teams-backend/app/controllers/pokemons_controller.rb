class PokemonsController < ApplicationController

  def index
    pokemons = Pokemon.all
    render json: PokemonSerializer.new(pokemons)
  end

  def show
    pokemon = Pokemon.find_by(id: params[:id])
    render json: PokemonSerializer.new(pokemon)
  end

  def create
    name = Faker::Name.first_name
    # byebug
    trainer_id = params[:trainer_id]
    species = Faker::Games::Pokemon.name
    pokemon = Pokemon.create(nickname: name, species: species, trainer_id: trainer_id)
    render json: PokemonSerializer.new(pokemon)
  end

  def destroy
    # byebug
    pokemon = Pokemon.find(params[:id])
    pokemon.destroy
    render json: pokemon
  end

end
