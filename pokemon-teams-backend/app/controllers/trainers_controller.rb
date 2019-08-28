class TrainersController < ApplicationController
  def index
    trainers = Trainer.all
    render json: TrainerSerializer.new(trainers)
  end

  def show
    trainer = Trainer.find_by(id: params[:id])
    options = {
      include: [:pokemons]
    }
    render json: TrainerSerializer.new(trainer, options)
  end

  def create
    trainer = Trainer.create(trainer_params)
    render json: trainer
  end

  def update
  end

  private

  def trainer_params
    params.require(:trainer).permit(:name)
  end

end
